import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCharacter } from "../../constants/CHARACTER";

import pencil from "../../assets/icons/pencil.svg";
import NavBar from "../../components/common/NavBar";

import { AuthStore } from "../../store/AuthStore";
import { UserStore } from "../../store/UserStore";
import { getProfile } from "../../apis/user";

import { Department } from "../../constants/DEPARTMENT";
import { Interest } from "../../constants/INTEREST";
import { STUDENT_STATUS } from "../../constants/STUDENT_STATUS";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const getDepartmentName = (id: string) => {
  return Department.find((item) => item.id === id)?.name ?? id;
};

const getInterestName = (id: string) => {
  return Interest.find((item) => item.id === id)?.name ?? id;
};

const getStatusName = (id: string) => {
  return STUDENT_STATUS.find((item) => item.id === id)?.name ?? id;
};

const MyPage = () => {
  const navigate = useNavigate();

  const accessToken = AuthStore((state) => state.accessToken);
  const user = UserStore((state) => state.user);
  const setUser = UserStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      setError(true);
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const response = await getProfile();

      console.log("백엔드 캐릭터:", user?.character);
      console.log("매핑된 캐릭터:", character);

      if (!response.data) {
        throw new Error("프로필 정보가 없습니다.");
      }

      setUser(response.data);
    } catch (err) {
      console.error("프로필 조회 실패:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, setUser]);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
    };

    void loadProfile();
  }, [fetchProfile]);

  const character = user ? getCharacter(user.character) : null;

  const primaryDepartment = user?.departments.find(
    (department) => department.type === "PRIMARY",
  );

  const nickname = user?.nickname || "-";

  const departmentName = primaryDepartment
    ? getDepartmentName(primaryDepartment.name)
    : "-";

  const academicStatus = user?.status ? getStatusName(user.status) : "-";

  const interests =
    user?.interests.map((interest) => getInterestName(interest.name)) ?? [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
      {error && (
        <div className="mt-5 text-center">
          <p className="text-[14px] text-gray-600">
            프로필 정보를 불러오지 못했어요.
          </p>

          <button
            type="button"
            onClick={() => void fetchProfile()}
            className="mt-2 text-[14px] font-semibold text-main underline"
          >
            다시 시도하기
          </button>
        </div>
      )}

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
    overflow-hidden
  "
              style={{ backgroundColor: character?.color ?? "#E9ECEF" }}
            >
              {character ? (
                <img
                  src={character.image}
                  alt="프로필 캐릭터"
                  className="w-[70%] h-[70%] object-contain"
                />
              ) : (
                <span className="text-[24px] text-gray-600">-</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/my/edit")}
            aria-label="프로필 수정"
            className="
              absolute bottom-1 right-1
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
          {nickname}
        </h2>
        <p
          className="
            mt-2
            text-center text-[16px]
            font-normal
            text-[#6C757D]
          "
        >
          {departmentName} · {academicStatus}
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
          {(interests.length > 0 ? interests : ["-"]).map((interest) => (
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
