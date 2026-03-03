const ADJECTIVES = [
  'Звёздный', 'Лунный', 'Солнечный', 'Тёмный', 'Огненный',
  'Ледяной', 'Золотой', 'Серебряный', 'Дикий', 'Тихий',
  'Быстрый', 'Хитрый', 'Смелый', 'Острый', 'Железный'
];

const NOUNS = [
  'Орион', 'Сириус', 'Вега', 'Альтаир', 'Денеб',
  'Арктур', 'Ригель', 'Антарес', 'Кастор', 'Поллукс',
  'Альдебаран', 'Капелла', 'Процион', 'Спика', 'Регул'
];

function generateNickname() {
  var adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  var noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  var num = Math.floor(Math.random() * 1000);
  return adj + ' ' + noun + ' ' + num;
}

module.exports = { generateNickname };
