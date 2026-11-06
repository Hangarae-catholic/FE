import { useNavigate } from "react-router-dom";
import { getCharacter } from "../../constants/CHARACTER";

import thumbsupCapy from "../../assets/images/capy_thumbs_up.svg";
import pencil from "../../assets/icons/pencil.svg";
import NavBar from "../../components/common/NavBar";

interface UserProfile {
  nickname: string;
  character: string;
  department: string;
  academicStatus: string;
  interests: string[];
}

const mockUser: UserProfile = {
  nickname: "아이브",
  character: thumbsupCapy,
  department: "미디어기술콘텐츠학부",
  academicStatus: "4학년",
  interests: [
    "IT·소프트웨어",
    "AI·데이터",
    "자격증·시험",
    "취업·창업·대외활동",
  ],
};

const MyPage = () => {
  const navigate = useNavigate();

  const user = mockUser;
  const character = getCharacter(user.character);

  return (
    <main
      className="
        min-h-0 w-full
        bg-bg font-pretendard
        pb-[130px]
      "
    >
      <h1
        className="
            -mt-10
          text-[20px] font-bold
          text-[#343A40]
        "
      >
        마이페이지
      </h1>

      <section
        className="
          mt-10 flex flex-col
          items-center
        "
      >
        <div className="relative w-[160px] h-[160px]">
          <div
            className="
              flex items-center justify-center
              w-full h-full
              rounded-full
              border-[2px] border-main
              bg-white
              p-[6px]
            "
          >
            <div
              className="
                flex items-center justify-center
                w-full h-full
                rounded-full
                bg-[#FFA556]
                overflow-hidden
              "
            >
              <img
                src={character.image}
                alt="프로필 캐릭터"
                className="
                  w-[70%] h-[70%]
                  object-contain
                "
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/my/edit")}
            aria-label="프로필 수정"
            className="
              absolute bottom-0 right-0
              flex items-center justify-center
              w-[36px] h-[36px]
              rounded-full
              border-[2px] border-white
              bg-main
              cursor-pointer
              transition-transform duration-200
              active:scale-95
            "
          >
            <img src={pencil} alt="" className="w-4.5 h-4.5" />
          </button>
        </div>

        <h2
          className="
            mt-4
            text-[18px] font-semibold
            text-[#202124]
          "
        >
          {user.nickname}
        </h2>
        <p
          className="
            mt-2
            text-center text-[16px]
            font-normal
            text-[#6C757D]
          "
        >
          {user.department} · {user.academicStatus}
        </p>
      </section>

      <section
        className="
          mt-5
          grid grid-cols-2 gap-4
        "
      >
        <button
          type="button"
          onClick={() => navigate("/my/activity")}
          className="
            flex items-center justify-center
            w-full h-[52px]
            rounded-[10px]
            bg-white
            text-[16px] font-semibold
            text-[#212529]
            cursor-pointer
            transition-colors duration-200
            active:bg-gray-50
          "
        >
          나의 활동
        </button>

        <button
          type="button"
          onClick={() => navigate("/my/manage")}
          className="
            flex items-center justify-center
            w-full h-[52px]
            rounded-[10px]
            bg-white
            text-[16px] font-semibold
            text-[#212529]
            cursor-pointer
            transition-colors duration-200
            active:bg-gray-50
          "
        >
          계정 관리
        </button>
      </section>

      <section className="mt-7">
        <h2
          className="
            mb-5
            text-[20px] font-bold
            text-[#202124]
          "
        >
          관심 분야
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {user.interests.map((interest) => (
            <div
              key={interest}
              className="
                flex items-center justify-center
                min-w-0 w-full h-[52px]
                rounded-[10px]
                bg-[#E9ECEF]
                px-2
                text-center text-[15px]
                font-medium text-[#5C636A]
                break-keep
              "
            >
              {interest}
            </div>
          ))}
        </div>
      </section>
      <NavBar />
    </main>
  );
};

export default MyPage;
