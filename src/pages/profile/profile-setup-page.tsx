import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import ProgressBar from "../../components/common/ProgressBar";
import matchCapy from "../../assets/images/capy_match_hand.svg";
import thumbsupCapy from "../../assets/images/capy_thumbs_up.svg";
import vCapy from "../../assets/images/capy_v.svg";
import greetingCapy from "../../assets/images/capy_greeting.svg";
import cheerupCapy from "../../assets/images/capy_cheer_up.svg";
import thinkingCapy from "../../assets/images/capy_thinking.svg";
import check from "../../assets/icons/check.svg";

const characterImages = [
  matchCapy,
  thumbsupCapy,
  vCapy,
  greetingCapy,
  cheerupCapy,
  thinkingCapy,
];

const characterColors = [
  "#FF665B",
  "#FFA85B",
  "#FFD95B",
  "#5BCA06",
  "#5B9DFF",
  "#F677C3",
];

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null,
  );

  const isValid = nickname.trim().length > 0 && selectedCharacter !== null;

  const handleNext = () => {
    if (!isValid || selectedCharacter === null) return;

    navigate("/profile/info", {
      state: {
        nickname: nickname.trim(),
        character: selectedCharacter,
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
            {characterImages.map((character, index) => {
              const isSelected = selectedCharacter === index;
              const isDimmed = selectedCharacter !== null && !isSelected;

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`캐릭터 ${index + 1} 선택`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCharacter(index)}
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
                      backgroundColor: characterColors[index],
                    }}
                  >
                    <img
                      src={character}
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
