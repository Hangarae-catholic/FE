import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHARACTERS, type CharacterType } from "../../constants/CHARACTER";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import ProgressBar from "../../components/common/ProgressBar";
import check from "../../assets/icons/check.svg";

const characterEntries = Object.entries(CHARACTERS) as [
  CharacterType,
  (typeof CHARACTERS)[CharacterType],
][];

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null);

  const isValid = nickname.trim().length > 0 && selectedCharacter !== null;

  const handleNext = () => {
    if (!isValid || selectedCharacter === null) return;

    navigate("/profile/info", {
      state: {
        nickname: nickname.trim(),
        character: CHARACTERS[selectedCharacter].apiValue,
      },
    });
  };

  return (
    <main
      className="
        relative flex flex-none flex-col
        w-[calc(100%+40px)]
        -mx-5 -mt-15
        h-dvh min-h-0
        overflow-hidden
        bg-bg
        font-pretendard
      "
    >
      <TopBar />

      <div
        className="
          min-h-0 flex-1
          overflow-y-auto
          px-5
          pb-[calc(120px+env(safe-area-inset-bottom,0px))]
        "
      >
        <div className="pt-16">
          <ProgressBar step={1} />
        </div>

        <section className="mt-10">
          <h1
            className="
              text-[24px]
              font-bold
              text-[#343A40]
              break-keep
            "
          >
            먼저, 프로필을 설정해볼까요?
          </h1>

          <p
            className="
              mt-2
              text-[14px]
              font-normal
              text-[#5C636A]
              break-keep
            "
          >
            사용할 닉네임과 캐릭터를 설정해주세요.
          </p>
        </section>

        <section className="mt-8">
          <label
            htmlFor="nickname"
            className="
              block mb-3
              text-[16px]
              font-medium
              text-gray-900
            "
          >
            닉네임
          </label>

          <input
            id="nickname"
            type="text"
            value={nickname}
            maxLength={20}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            autoComplete="nickname"
            className="
              w-full h-[52px]
              px-5
              rounded-[12px]
              bg-gray-200
              font-pretendard
              font-normal
              text-[16px]
              text-gray-900
              placeholder:text-[#ADB5BD]
              outline-none
            "
          />

          <p
            className="
              mt-2 pr-1
              text-right
              text-[14px]
              font-normal
              text-[#868E96]
            "
          >
            {nickname.length}/20
          </p>
        </section>

        <section className="mt-6">
          <h2
            className="
              text-[16px]
              font-medium
              text-gray-900
            "
          >
            캐릭터
          </h2>

          <p
            className="
              mt-1
              text-[14px]
              font-normal
              text-gray-700
            "
          >
            나를 표현할 캐릭터를 선택해봐요
          </p>

          <div className="grid grid-cols-4 gap-x-3 gap-y-4 mt-6">
            {characterEntries.map(([type, character]) => {
              const isSelected = selectedCharacter === type;
              const isDimmed = selectedCharacter !== null && !isSelected;

              return (
                <button
                  key={type}
                  type="button"
                  aria-label={`캐릭터 ${type} 선택`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCharacter(type)}
                  className="
          relative
          w-full aspect-square
          rounded-full
          cursor-pointer
        "
                >
                  <div
                    className={`
            flex items-center justify-center
            w-full h-full
            rounded-full
            overflow-hidden
            transition-opacity duration-200
            ${isDimmed ? "opacity-40" : "opacity-100"}
          `}
                    style={{
                      backgroundColor: character.color,
                    }}
                  >
                    <img
                      src={character.image}
                      alt=""
                      className="
              w-[65%] h-[65%]
              object-contain
            "
                    />
                  </div>

                  {isSelected && (
                    <img
                      src={check}
                      alt=""
                      className="absolute -top-1 -right-1 w-8 h-8"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <BottomButton text="다음" onClick={handleNext} disabled={!isValid} />
    </main>
  );
};

export default ProfileSetupPage;
