import matchCapy from '../assets/images/capy_match_hand.svg';
import thumbsupCapy from '../assets/images/capy_thumbs_up.svg';
import vCapy from '../assets/images/capy_v.svg';
import greetingCapy from '../assets/images/capy_greeting.svg';
import cheerupCapy from '../assets/images/capy_cheer_up.svg';
import thinkingCapy from '../assets/images/capy_thinking.svg';

export const CHARACTERS = {
  MATCH_HAND: {
    image: matchCapy,
    color: '#FF665B',
  },
  THUMBS_UP: {
    image: thumbsupCapy,
    color: '#FFA85B',
  },
  V: {
    image: vCapy,
    color: '#FFD95B',
  },
  GREETING: {
    image: greetingCapy,
    color: '#5BCA06',
  },
  CHEER_UP: {
    image: cheerupCapy,
    color: '#5B9DFF',
  },
  THINKING: {
    image: thinkingCapy,
    color: '#F677C3',
  },
} as const;

export type CharacterType = keyof typeof CHARACTERS;

export const getCharacter = (character: string | undefined) => {
  if (character && character in CHARACTERS) {
    return CHARACTERS[character as CharacterType];
  }

  return CHARACTERS.THUMBS_UP;
};
