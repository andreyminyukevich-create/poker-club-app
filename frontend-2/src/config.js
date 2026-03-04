var IMG = 'https://buufaehdtlrriymyrgxh.supabase.co/storage/v1/object/public/image'

export var IMAGES = {
  chipRed: IMG + '/chip-red.png.png',
  chipGreen: IMG + '/chip-green.png.png',
  chipBlack: IMG + '/chip-black.png.png',
  chipGold: IMG + '/chip-gold.png.png',
  chipSilver: IMG + '/chip-silver.png.png',
  bannerTournament: IMG + '/banner-tournament.png.png',
  bannerRating: IMG + '/banner-rating.png.png',
  bannerAbout: IMG + '/banner-about.png.png',
  bgRed: IMG + '/bg-red.png.png',
  bgGold: IMG + '/bg-gold.png.png',
  bgPurple: IMG + '/bg-purple.png.png',
  bgSilver: IMG + '/bg-silver.png.png',
  bgBlue: IMG + '/bg-blue.png.png',
  avatarDefault: IMG + '/avatar-default.png.png',
  trophy: IMG + '/trophy.png.png',
  logo: IMG + '/logo.png',
}

// Rotate chips for tournament cards
var CHIPS = [
  IMG + '/chip-red.png.png',
  IMG + '/chip-green.png.png',
  IMG + '/chip-black.png.png',
  IMG + '/chip-gold.png.png',
  IMG + '/chip-silver.png.png',
]

export function getChipForTournament(index) {
  return CHIPS[index % CHIPS.length]
}
