import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHARACTERS, type CharacterType } from "../../constants/CHARACTER";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import BottomSheet from "../../components/common/BottomSheet/BottomSheet";
import Modal from "../../components/common/Modal";

import arrowDown from "../../assets/icons/arrow_down.svg";
import deleteOrange from "../../assets/icons/delete-orange.svg";
import check from "../../assets/icons/check.svg";

// 학과 데이터: 추후 API 데이터로 교체
const departmentData: Record<string, string[]> = {
  경영대학: ["경영학과", "회계학과"],
  바이오헬스융합대학: ["바이오메디컬소프트웨어학과", "의생명과학과"],
  AI전자정보융합대학: [
    "미디어기술콘텐츠학과",
    "컴퓨터정보공학부",
    "인공지능학과",
  ],
  약학대학: ["약학과"],
  인문사회계열: ["국어국문학과", "영어영문학과", "심리학과"],
  자연공학계열: ["수학과", "화학과"],
};

const academicStatuses = ["1학년", "2학년", "3학년", "4학년", "휴학", "졸업"];

const interestOptions = [
  "경영·회계·금융",
  "경제·무역·국제",
  "IT·소프트웨어",
  "AI·데이터",
  "디자인·패션·공간",
  "콘텐츠·미디어·예술",
  "자격증·시험",
  "취업·창업·대외활동",
];

interface ProfileForm {
  nickname: string;
  character: CharacterType;
  primaryCollege: string;
  primaryDepartment: string;
  doubleMajorCollege: string;
  doubleMajorDepartment: string;
  academicStatus: string;
  interests: string[];
}

const initialProfile: ProfileForm = {
  nickname: "아이브",
  character: "THUMBS_UP",
  primaryCollege: "AI전자정보융합대학",
  primaryDepartment: "미디어기술콘텐츠학과",
  doubleMajorCollege: "AI전자정보융합대학",
  doubleMajorDepartment: "컴퓨터정보공학부",
  academicStatus: "휴학",
  interests: [
    "IT·소프트웨어",
    "AI·데이터",
    "자격증·시험",
    "취업·창업·대외활동",
  ],
};

type SheetType =
  | "primaryCollege"
  | "primaryDepartment"
  | "doubleMajorCollege"
  | "doubleMajorDepartment"
  | "academicStatus"
  | "interests"
  | null;

interface SelectFieldProps {
  value: string;
  placeholder: string;
  onClick: () => void;
}

const SelectField = ({ value, placeholder, onClick }: SelectFieldProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center justify-between
        w-full h-[52px]
        rounded-[12px]
        bg-[#E9ECEF]
        px-5
        text-left
        cursor-pointer
      "
    >
      <span
        className={`
          min-w-0 truncate text-[16px]
          ${value ? "text-[#343A40]" : "text-[#868E96]"}
        `}
      >
        {value || placeholder}
      </span>

      <img
        src={arrowDown}
        alt=""
        aria-hidden="true"
        className="w-5 h-5 shrink-0"
      />
    </button>
  );
};

const ProfileEditPage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileForm>({ ...initialProfile });

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [hasDoubleMajor, setHasDoubleMajor] = useState(
    Boolean(
      initialProfile.doubleMajorCollege || initialProfile.doubleMajorDepartment,
    ),
  );

  const updateProfile = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isChanged =
    JSON.stringify(profile) !== JSON.stringify(initialProfile) ||
    hasDoubleMajor !==
      Boolean(
        initialProfile.doubleMajorCollege ||
        initialProfile.doubleMajorDepartment,
      );

  const isValid =
    profile.nickname.trim().length > 0 &&
    profile.primaryCollege !== "" &&
    profile.primaryDepartment !== "" &&
    profile.academicStatus !== "" &&
    profile.interests.length > 0 &&
    (!hasDoubleMajor ||
      (profile.doubleMajorCollege !== "" &&
        profile.doubleMajorDepartment !== ""));

  // 뒤로가기
  const handleBack = () => {
    if (isChanged) {
      setIsCancelModalOpen(true);
      return;
    }

    navigate(-1);
  };

  // 저장
  const handleSave = () => {
    if (!isValid) return;

    const updatedProfile = {
      ...profile,
      nickname: profile.nickname.trim(),
      doubleMajorCollege: hasDoubleMajor ? profile.doubleMajorCollege : "",
      doubleMajorDepartment: hasDoubleMajor
        ? profile.doubleMajorDepartment
        : "",
    };

    // TODO: 프로필 수정 API 연동
    console.log("수정된 프로필:", updatedProfile);

    navigate("/my");
  };

  const handleDeleteDoubleMajor = () => {
    setHasDoubleMajor(false);

    setProfile((prev) => ({
      ...prev,
      doubleMajorCollege: "",
      doubleMajorDepartment: "",
    }));
  };

  const handleRemoveInterest = (interest: string) => {
    updateProfile(
      "interests",
      profile.interests.filter((item) => item !== interest),
    );
  };

  const colleges = Object.keys(departmentData);

  const getSheetConfig = () => {
    switch (activeSheet) {
      case "primaryCollege":
        return {
          title: "제1전공 계열 선택",
          options: colleges,
          selected: [profile.primaryCollege],
          onChange: (values: string[]) => {
            setProfile((prev) => ({
              ...prev,
              primaryCollege: values[0] ?? "",
              primaryDepartment: "",
            }));
          },
        };

      case "primaryDepartment":
        return {
          title: "제1전공 학과 선택",
          options: departmentData[profile.primaryCollege] ?? [],
          selected: [profile.primaryDepartment],
          onChange: (values: string[]) => {
            updateProfile("primaryDepartment", values[0] ?? "");
          },
        };

      case "doubleMajorCollege":
        return {
          title: "복수 전공 계열 선택",
          options: colleges,
          selected: [profile.doubleMajorCollege],
          onChange: (values: string[]) => {
            setProfile((prev) => ({
              ...prev,
              doubleMajorCollege: values[0] ?? "",
              doubleMajorDepartment: "",
            }));
          },
        };

      case "doubleMajorDepartment":
        return {
          title: "복수 전공 학과 선택",
          options: departmentData[profile.doubleMajorCollege] ?? [],
          selected: [profile.doubleMajorDepartment],
          onChange: (values: string[]) => {
            updateProfile("doubleMajorDepartment", values[0] ?? "");
          },
        };

      case "academicStatus":
        return {
          title: "학적 상태 선택",
          options: academicStatuses,
          selected: [profile.academicStatus],
          onChange: (values: string[]) => {
            updateProfile("academicStatus", values[0] ?? "");
          },
        };

      case "interests":
        return {
          title: "관심 분야 선택",
          options: interestOptions,
          selected: profile.interests,
          onChange: (values: string[]) => {
            updateProfile("interests", values);
          },
          multiple: true,
          maxSelections: 4,
          columns: 2 as const,
          description:
            "관심있거나 진로로 하는 분야를 알려주세요\n(최대 4개까지 선택 가능)",
        };

      default:
        return null;
    }
  };

  const sheetConfig = getSheetConfig();

  return (
    <main
      className="
        relative flex flex-none flex-col
        w-[calc(100%+40px)] -mx-5 -mt-15
        h-dvh min-h-0
        overflow-hidden
        bg-bg font-pretendard
      "
    >
      <TopBar title="프로필 설정" leftOnClick={handleBack} />

      <div
        className="
          min-h-0 flex-1
          overflow-y-auto
          px-5 pt-17
          pb-[calc(120px+env(safe-area-inset-bottom,0px))]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <section>
          <label
            htmlFor="nickname"
            className="
              block mb-3
              text-[16px] font-medium
              text-[#343A40]
            "
          >
            닉네임
          </label>

          <input
            id="nickname"
            type="text"
            value={profile.nickname}
            maxLength={20}
            onChange={(e) => updateProfile("nickname", e.target.value)}
            className="
              w-full h-[52px]
              rounded-[12px]
              bg-[#E9ECEF]
              px-5
              text-[16px] text-[#343A40]
              outline-none
            "
          />

          <p className="mt-2 text-right text-[14px] text-[#868E96]">
            {profile.nickname.length}/20
          </p>
        </section>

        <section className="mt-5">
          <h2 className="text-[16px] font-medium text-[#343A40]">캐릭터</h2>

          <p className="mt-1 text-[14px] text-[#5C636A]">
            나를 표현할 캐릭터를 선택해봐요
          </p>

          <div
            className="
              mt-5
              grid grid-cols-4
              gap-x-4 gap-y-4
            "
          >
            {(
              Object.entries(CHARACTERS) as [
                CharacterType,
                (typeof CHARACTERS)[CharacterType],
              ][]
            ).map(([type, character]) => {
              const isSelected = profile.character === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateProfile("character", type)}
                  aria-label={`${type} 캐릭터 선택`}
                  aria-pressed={isSelected}
                  className={`
                    relative
                    aspect-square w-full
                    rounded-full
                    flex items-center justify-center
                    cursor-pointer
                    transition-opacity duration-200
                    ${isSelected ? "opacity-100" : "opacity-40"}
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

                  {isSelected && (
                    <img
                      src={check}
                      alt=""
                      className="absolute -top-1 -right-1
                        flex items-center justify-center
                        w-8 h-8"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-[16px] font-medium text-[#343A40]">
            제 1전공 계열
            <span className="ml-1 text-[#F04438]">*</span>
          </h2>

          <SelectField
            value={profile.primaryCollege}
            placeholder="전공 계열을 선택해주세요"
            onClick={() => setActiveSheet("primaryCollege")}
          />
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-[16px] font-medium text-[#343A40]">
            제 1전공 학과
            <span className="ml-1 text-[#F04438]">*</span>
          </h2>

          <SelectField
            value={profile.primaryDepartment}
            placeholder="학과를 선택해주세요"
            onClick={() => {
              if (!profile.primaryCollege) {
                setActiveSheet("primaryCollege");
                return;
              }

              setActiveSheet("primaryDepartment");
            }}
          />
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-medium text-[#343A40]">
              복수 전공 (선택)
            </h2>

            {hasDoubleMajor && (
              <button
                type="button"
                onClick={handleDeleteDoubleMajor}
                className="
                  text-[14px]
                  text-[#6C757D]
                  underline
                  cursor-pointer
                "
              >
                삭제
              </button>
            )}
          </div>

          {hasDoubleMajor ? (
            <div className="flex flex-col gap-3">
              <SelectField
                value={profile.doubleMajorCollege}
                placeholder="복수 전공 계열 선택"
                onClick={() => setActiveSheet("doubleMajorCollege")}
              />

              <SelectField
                value={profile.doubleMajorDepartment}
                placeholder="복수 전공 학과 선택"
                onClick={() => {
                  if (!profile.doubleMajorCollege) {
                    setActiveSheet("doubleMajorCollege");
                    return;
                  }

                  setActiveSheet("doubleMajorDepartment");
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHasDoubleMajor(true)}
              className="
                flex items-center justify-center
                gap-3
                w-full h-[52px]
                rounded-[12px]
                border border-[#DEE2E6]
                text-[16px] text-[#6C757D]
                cursor-pointer
              "
            >
              <span className="text-[24px] leading-none">+</span>
              복수 전공 추가하기
            </button>
          )}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-[16px] font-medium text-[#343A40]">
            학적 상태
            <span className="ml-1 text-[#F04438]">*</span>
          </h2>

          <SelectField
            value={profile.academicStatus}
            placeholder="학적 상태를 선택해주세요"
            onClick={() => setActiveSheet("academicStatus")}
          />
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-[16px] font-medium text-[#343A40]">
            관심 분야
            <span className="ml-1 text-[#F04438]">*</span>
          </h2>

          <div
            className="
              relative
              w-full min-h-[52px]
              rounded-[12px]
              bg-[#E9ECEF]
              px-5 py-4
            "
          >
            <button
              type="button"
              onClick={() => setActiveSheet("interests")}
              aria-label="관심 분야 선택"
              className="
                absolute right-5 top-4
                cursor-pointer
              "
            >
              <img src={arrowDown} alt="" className="w-5 h-5" />
            </button>

            {profile.interests.length > 0 ? (
              <div
                className="
                  flex flex-col items-start gap-3
                  pr-8
                "
              >
                {profile.interests.map((interest) => (
                  <div
                    key={interest}
                    className="
                      flex items-center gap-2
                      rounded-[10px]
                      bg-white
                      px-3 py-2
                    "
                  >
                    <span className="text-[15px] text-[#343A40]">
                      {interest}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      aria-label={`${interest} 삭제`}
                      className="cursor-pointer"
                    >
                      <img src={deleteOrange} alt="" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveSheet("interests")}
                className="
                  text-[16px] text-[#868E96]
                  cursor-pointer
                "
              >
                관심 분야를 선택해주세요
              </button>
            )}
          </div>
        </section>
      </div>

      <BottomButton text="저장" onClick={handleSave} disabled={!isValid} />

      {sheetConfig && (
        <BottomSheet
          isOpen={activeSheet !== null}
          onClose={() => setActiveSheet(null)}
          title={sheetConfig.title}
          description={sheetConfig.description}
          options={sheetConfig.options}
          selected={sheetConfig.selected}
          onChange={sheetConfig.onChange}
          multiple={sheetConfig.multiple}
          maxSelections={sheetConfig.maxSelections}
          columns={sheetConfig.columns}
          searchable={
            activeSheet === "primaryDepartment" ||
            activeSheet === "doubleMajorDepartment" ||
            activeSheet === "interests"
          }
          initialHeight={0.55}
        />
      )}

      {isCancelModalOpen && (
        <Modal
          title="수정을 취소할까요?"
          content="저장하지 않은 변경사항은 사라져요."
          leftBtn="계속 수정"
          cancel={() => setIsCancelModalOpen(false)}
          rightBtn="나가기"
          rightBtnColor="ORANGE"
          onClick={() => {
            setIsCancelModalOpen(false);
            navigate(-1);
          }}
        />
      )}
    </main>
  );
};

export default ProfileEditPage;
