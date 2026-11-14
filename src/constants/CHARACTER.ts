import matchCapy from "../assets/images/capy_match_hand.svg";
import thumbsupCapy from "../assets/images/capy_thumbs_up.svg";
import vCapy from "../assets/images/capy_v.svg";
import greetingCapy from "../assets/images/capy_greeting.svg";
import cheerupCapy from "../assets/images/capy_cheer_up.svg";
import thinkingCapy from "../assets/images/capy_thinking.svg";

export const CHARACTERS = {
  MATCH_HAND: {
    image: matchCapy,
    color: "#FF665B",
    apiValue: "A",
  },
  THUMBS_UP: {
    image: thumbsupCapy,
    color: "#FFA85B",
    apiValue: "B",
  },
  V: {
    image: vCapy,
    color: "#FFD95B",
    apiValue: "C",
  },
  GREETING: {
    image: greetingCapy,
    color: "#5BCA06",
    apiValue: "D",
  },
  CHEER_UP: {
    image: cheerupCapy,
    color: "#5B9DFF",
    apiValue: "E",
  },
  THINKING: {
    image: thinkingCapy,
    color: "#F677C3",
    apiValue: "F",
  },
} as const;

export type CharacterType = keyof typeof CHARACTERS;

export const getCharacter = (character: string | undefined) => {
  if (!character) return CHARACTERS.THUMBS_UP;

  // 백엔드 Enum(A~F) 또는 프론트 캐릭터 ID로 검색
  const found = Object.entries(CHARACTERS).find(
    ([key, value]) => key === character || value.apiValue === character,
  );

  if (!found) {
    console.warn("알 수 없는 캐릭터 값:", character);
    return CHARACTERS.THUMBS_UP;
  }

  return found[1];
};
