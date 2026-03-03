import { useState, useEffect } from 'react';

export default function useTelegram() {
  var tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

  useEffect(function() {
    if (tg) {
      tg.expand();
      tg.setBackgroundColor('#1B2D5E');
      tg.ready();
    }
  }, []);

  var user = tg?.initDataUnsafe?.user || null;
  var initData = tg?.initData || '';

  return { tg: tg, user: user, initData: initData };
}
