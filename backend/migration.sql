-- ============================================
-- МИГРАЦИЯ v2: constraints, indexes, RPC functions
-- Выполнить в Supabase SQL Editor ПЕРЕД деплоем
-- ============================================

-- 1. CONSTRAINTS

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey') THEN
    ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (tg_id);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ratings_tg_id_season_unique') THEN
    ALTER TABLE ratings ADD CONSTRAINT ratings_tg_id_season_unique UNIQUE (tg_id, season);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ratings_tg_id_fk') THEN
    ALTER TABLE ratings ADD CONSTRAINT ratings_tg_id_fk FOREIGN KEY (tg_id) REFERENCES users(tg_id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'registrations_tournament_id_fk') THEN
    ALTER TABLE registrations ADD CONSTRAINT registrations_tournament_id_fk FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. INDEXES

CREATE INDEX IF NOT EXISTS idx_reg_tournament ON registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_reg_tg_id ON registrations(tg_id);
CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_tourn_date ON tournaments(date);
CREATE INDEX IF NOT EXISTS idx_tourn_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_ratings_season ON ratings(season);
CREATE INDEX IF NOT EXISTS idx_ratings_points ON ratings(points DESC);

-- 3. НОВЫЕ ПОЛЯ

ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS registration_open boolean DEFAULT true;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS registration_deadline timestamptz;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 4. RPC: Атомарная регистрация

CREATE OR REPLACE FUNCTION register_for_tournament(p_tg_id bigint, p_tournament_id integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_t tournaments%ROWTYPE;
  v_ex registrations%ROWTYPE;
  v_cnt integer;
  v_st text;
BEGIN
  SELECT * INTO v_t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF v_t IS NULL THEN RETURN '{"ok":false,"error":"Турнир не найден"}'::jsonb; END IF;
  IF v_t.status != 'активен' THEN RETURN '{"ok":false,"error":"Турнир не активен"}'::jsonb; END IF;
  IF v_t.registration_open = false THEN RETURN '{"ok":false,"error":"Регистрация закрыта"}'::jsonb; END IF;
  IF v_t.registration_deadline IS NOT NULL AND now() > v_t.registration_deadline THEN
    RETURN '{"ok":false,"error":"Дедлайн регистрации прошёл"}'::jsonb;
  END IF;

  SELECT * INTO v_ex FROM registrations
  WHERE tg_id = p_tg_id AND tournament_id = p_tournament_id AND status != 'отменён';
  IF v_ex IS NOT NULL THEN RETURN '{"ok":false,"error":"Вы уже записаны"}'::jsonb; END IF;

  SELECT count(*) INTO v_cnt FROM registrations
  WHERE tournament_id = p_tournament_id AND status = 'записан';
  v_st := CASE WHEN v_cnt >= v_t.seats THEN 'лист ожидания' ELSE 'записан' END;

  INSERT INTO registrations (tg_id, tournament_id, status, created_at, updated_at)
  VALUES (p_tg_id, p_tournament_id, v_st, now(), now());

  RETURN jsonb_build_object('ok', true, 'status', v_st);
END; $$;

-- 5. RPC: Отмена + автоперевод из waitlist

CREATE OR REPLACE FUNCTION cancel_registration(p_tg_id bigint, p_tournament_id integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_reg registrations%ROWTYPE;
  v_was boolean;
  v_next registrations%ROWTYPE;
BEGIN
  SELECT * INTO v_reg FROM registrations
  WHERE tg_id = p_tg_id AND tournament_id = p_tournament_id AND status != 'отменён' FOR UPDATE;
  IF v_reg IS NULL THEN RETURN '{"ok":false,"error":"Регистрация не найдена"}'::jsonb; END IF;

  v_was := (v_reg.status = 'записан');
  UPDATE registrations SET status = 'отменён', updated_at = now() WHERE id = v_reg.id;

  IF v_was THEN
    SELECT * INTO v_next FROM registrations
    WHERE tournament_id = p_tournament_id AND status = 'лист ожидания'
    ORDER BY created_at ASC LIMIT 1 FOR UPDATE;
    IF v_next IS NOT NULL THEN
      UPDATE registrations SET status = 'записан', updated_at = now() WHERE id = v_next.id;
      RETURN jsonb_build_object('ok', true, 'promoted_tg_id', v_next.tg_id);
    END IF;
  END IF;
  RETURN '{"ok":true}'::jsonb;
END; $$;

-- 6. RPC: Атомарное создание user + rating

CREATE OR REPLACE FUNCTION upsert_user_with_rating(
  p_tg_id bigint, p_nickname text, p_first_name text, p_last_name text, p_city text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user jsonb;
  v_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM users WHERE tg_id = p_tg_id) INTO v_exists;
  IF v_exists THEN
    UPDATE users SET
      first_name = COALESCE(NULLIF(p_first_name, ''), first_name),
      last_name = COALESCE(NULLIF(p_last_name, ''), last_name),
      city = COALESCE(NULLIF(p_city, ''), city)
    WHERE tg_id = p_tg_id;
    SELECT to_jsonb(u) INTO v_user FROM users u WHERE tg_id = p_tg_id;
    RETURN jsonb_build_object('ok', true, 'data', v_user, 'created', false);
  END IF;

  INSERT INTO users (tg_id, nickname, first_name, last_name, city, created_at)
  VALUES (p_tg_id, p_nickname, p_first_name, COALESCE(p_last_name, ''), COALESCE(p_city, ''), now());
  INSERT INTO ratings (tg_id, nickname, season, knockouts, points, city, updated_at)
  VALUES (p_tg_id, p_nickname, EXTRACT(YEAR FROM now())::integer, 0, 0, COALESCE(p_city, ''), now());

  SELECT to_jsonb(u) INTO v_user FROM users u WHERE tg_id = p_tg_id;
  RETURN jsonb_build_object('ok', true, 'data', v_user, 'created', true);
END; $$;
