const ADJECTIVES = [
  'Zvyozdnyj', 'Lunnyj', 'Solnechnyj', 'Tyomnyj', 'Ognennyj',
  'Ledyanoj', 'Zolotoj', 'Serebryanyj', 'Dikij', 'Tikhij',
  'Bystryj', 'Khitryj', 'Smelyj', 'Ostryj', 'Zheleznyj'
];

const NOUNS = [
  'Orion', 'Sirius', 'Vega', 'Altair', 'Deneb',
  'Arktur', 'Rigel', 'Antares', 'Kastor', 'Polluks',
  'Aldebaran', 'Kapella', 'Procion', 'Spika', 'Regul'
];

function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 1000);
  return adj + ' ' + noun + ' ' + num;
}

module.exports = { generateNickname };
