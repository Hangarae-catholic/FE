import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import ProgressBar from "../../components/common/ProgressBar";
import BottomSheet from "../../components/common/BottomSheet/BottomSheet";
import arrowDown from "../../assets/icons/arrow_down.svg";
import deleteOrange from "../../assets/icons/delete-orange.svg";

type SheetType =
  | "primaryCollege"
  | "primaryDepartment"
  | "secondaryCollege"
  | "secondaryDepartment"
  | "academicStatus"
  | "interests";

const collegeOptions = [
  "경영대학",
  "바이오헬스융합대학",
  "AI전자정보융합대학",
  "약학대학",
  "인문사회계열",
  "자연공학계열",
  "예체능계열",
  "교직과정",
  "자유전공학부",
  "대학융합전공",
];

const departmentOptions: Record<string, string[]> = {
  경영대학: [
    "경영학과",
    "회계학과",
    "국제경영학과",
    "세무회계금융학과",
    "IT파이낸스학과",
  ],
  바이오헬스융합대학: [
    "생명공학과",
    "바이오메디컬화학공학과",
    "바이오로직스공학부",
    "AI의공학과",
    "의생명공학과",
    "바이오메디컬소프트웨어학과",
  ],
  AI전자정보융합대학: [
    "컴퓨터정보공학부",
    "미디어기술콘텐츠학과",
    "정보통신전자공학부",
    "인공지능학과",
    "데이터사이언스학과",
  ],
  약학대학: ["약학과"],
  인문사회계열: [
    "국어국문학과",
    "철학과",
    "국사학과",
    "영어영문학부",
    "중국언어문화학과",
    "일어일본문화학과",
    "프랑스어문화학과",
    "사회복지학과",
    "심리학과",
    "사회학과",
    "아동학과",
    "특수교육과",
    "국제학부",
    "법학과",
    "경제학과",
    "행정학과",
  ],
  자연공학계열: [
    "수학과",
    "화학과",
    "물리학과",
    "에너지환경공학과",
    "공간디자인・소비자학과",
    "의류학과",
    "식품영양학과",
  ],
  예체능계열: ["음악과", "예술미디어융합학과"],
  교직과정: ["교직과"],
  자유전공: ["자유전공학부"],
  대학융합전공: ["융합전공학부"],
};

const academicStatusOptions = [
  "1학년",
  "2학년",
  "3학년",
  "4학년",
  "휴학",
  "졸업유예",
  "졸업",
];

const interestOptions = [
  "경영·회계·금융",
  "경제·무역·국제",
  "인문·역사·철학",
  "사회·복지·심리",
  "바이오·생명과학",
  "화학·에너지·환경",
  "반도체·전자·통신",
  "의료·보건·약학",
  "IT·소프트웨어",
  "AI·데이터",
  "마케팅·광고·홍보",
  "기획·PM",
  "디자인·패션·공간",
  "콘텐츠·미디어·예술",
  "교육·교직",
  "법률·정책",
  "행정·공공기관",
  "외국어·언어",
  "자격증·시험",
  "취업·창업·대외활동",
];

interface SelectFieldProps {
  value: string;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
}

const SelectField = ({
  value,
  placeholder,
  onClick,
  disabled = false,
}: SelectFieldProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        flex items-center justify-between
        gap-3
        w-full h-[52px]
        px-5
        rounded-[12px]
        bg-gray-200
        text-left
        cursor-pointer
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
    >
      <span
        className={`
          min-w-0 flex-1 truncate
          text-[16px]
          font-normal
          ${value ? "text-[#343A40]" : "text-[#ADB5BD]"}
        `}
      >
        {value || placeholder}
      </span>

      <img
        src={arrowDown}
        alt=""
        aria-hidden="true"
        className="w-7 h-7 shrink-0"
      />
    </button>
  );
};

const ProfileInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [primaryCollege, setPrimaryCollege] = useState("");
  const [primaryDepartment, setPrimaryDepartment] = useState("");

  const [hasSecondMajor, setHasSecondMajor] = useState(false);
  const [secondaryCollege, setSecondaryCollege] = useState("");
  const [secondaryDepartment, setSecondaryDepartment] = useState("");

  const [academicStatus, setAcademicStatus] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);

  const isValid =
    primaryCollege !== "" &&
    primaryDepartment !== "" &&
    academicStatus !== "" &&
    interests.length > 0 &&
    (!hasSecondMajor ||
      (secondaryCollege !== "" && secondaryDepartment !== ""));

  const handleRemoveSecondMajor = () => {
    setHasSecondMajor(false);
    setSecondaryCollege("");
    setSecondaryDepartment("");
  };

  const handleNext = () => {
    if (!isValid) return;

    navigate("/profile/complete", {
      state: {
        ...location.state,
        primaryCollege,
        primaryDepartment,
        secondaryCollege: hasSecondMajor ? secondaryCollege : null,
        secondaryDepartment: hasSecondMajor ? secondaryDepartment : null,
        academicStatus,
        interests,
      },
    });
  };

  const getSheetConfig = () => {
    switch (activeSheet) {
      case "primaryCollege":
        return {
          title: "제 1전공 계열 선택",
          options: collegeOptions,
          selected: [primaryCollege],
          searchable: true,
          searchPlaceholder: "계열을 검색해주세요",
          onChange: (values: string[]) => {
            setPrimaryCollege(values[0] ?? "");
            setPrimaryDepartment("");
          },
        };

      case "primaryDepartment":
        return {
          title: "제 1전공 학과 선택",
          options: departmentOptions[primaryCollege] ?? [],
          selected: [primaryDepartment],
          searchable: true,
          searchPlaceholder: "학과를 검색해주세요",
          onChange: (values: string[]) => {
            setPrimaryDepartment(values[0] ?? "");
          },
        };

      case "secondaryCollege":
        return {
          title: "복수 전공 계열 선택",
          options: collegeOptions,
          selected: [secondaryCollege],
          searchable: true,
          searchPlaceholder: "계열을 검색해주세요",
          onChange: (values: string[]) => {
            setSecondaryCollege(values[0] ?? "");
            setSecondaryDepartment("");
          },
        };

      case "secondaryDepartment":
        return {
          title: "복수 전공 학과 선택",
          options: departmentOptions[secondaryCollege] ?? [],
          selected: [secondaryDepartment],
          searchable: true,
          searchPlaceholder: "학과를 검색해주세요",
          onChange: (values: string[]) => {
            setSecondaryDepartment(values[0] ?? "");
          },
        };

      case "academicStatus":
        return {
          title: "학적 상태 선택",
          options: academicStatusOptions,
          selected: [academicStatus],
          searchable: false,
          onChange: (values: string[]) => {
            setAcademicStatus(values[0] ?? "");
          },
        };

      case "interests":
        return {
          title: "관심 분야 선택",
          description:
            "관심있거나 진로로 하는 분야를 알려주세요\n(최대 4개까지 선택 가능)",
          options: interestOptions,
          selected: interests,
          multiple: true,
          maxSelections: 4,
          searchable: true,
          searchPlaceholder: "관심 분야를 검색해보세요",
          columns: 2 as const,
          onChange: (values: string[]) => {
            setInterests(values);
          },
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
        w-[calc(100%+40px)]
        -mx-5 -mt-15
        h-dvh min-h-0
        overflow-hidden
        bg-bg font-pretendard
      "
    >
      <TopBar />

      <div className="shrink-0 bg-bg px-5 pt-16 pb-4">
        <ProgressBar step={2} />
      </div>

      <div
        className="
          min-h-0 flex-1 overflow-y-auto
          px-5
          pb-[calc(120px+env(safe-area-inset-bottom,0px))]
        "
      >
        <section className="mt-6">
          <h1
            className="
              text-[24px] font-bold
              text-gray-900 break-keep
            "
          >
            전공과 학적을 알려주세요.
          </h1>

          <p
            className="
              mt-2 text-[14px]
              font-normal text-gray-700
            "
          >
            선택된 전공과 학적을 기반으로 추천해드릴게요
          </p>
        </section>

        <section className="mt-8">
          <label className="block mb-3 text-[16px] font-medium text-gray-900">
            제 1전공 계열 <span className="text-error">*</span>
          </label>

          <SelectField
            value={primaryCollege}
            placeholder="계열을 선택해주세요"
            onClick={() => setActiveSheet("primaryCollege")}
          />
        </section>

        <section className="mt-7">
          <label className="block mb-3 text-[16px] font-medium text-gray-900">
            제 1전공 학과 <span className="text-error">*</span>
          </label>

          <SelectField
            value={primaryDepartment}
            placeholder="학과를 선택해주세요"
            disabled={!primaryCollege}
            onClick={() => setActiveSheet("primaryDepartment")}
          />
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-medium text-gray-900">
              복수 전공 <span className="text-gray-600">(선택)</span>
            </h2>

            {hasSecondMajor && (
              <button
                type="button"
                onClick={handleRemoveSecondMajor}
                className="
                  text-[14px] text-gray-600
                  underline underline-offset-4
                  cursor-pointer
                "
              >
                삭제
              </button>
            )}
          </div>

          {hasSecondMajor && (
            <div className="flex flex-col gap-3">
              <SelectField
                value={secondaryCollege}
                placeholder="계열을 선택해주세요"
                onClick={() => setActiveSheet("secondaryCollege")}
              />

              <SelectField
                value={secondaryDepartment}
                placeholder="학과를 선택해주세요"
                disabled={!secondaryCollege}
                onClick={() => setActiveSheet("secondaryDepartment")}
              />
            </div>
          )}

          {!hasSecondMajor && (
            <button
              type="button"
              onClick={() => setHasSecondMajor(true)}
              className="
                flex items-center justify-center
                gap-4
                w-full h-[52px]
                rounded-[12px]
                border border-[#CED4DA]
                text-gray-700 text-[16px]
                font-medium
                cursor-pointer
              "
            >
              <span className="text-[24px] font-normal leading-none">+</span>
              복수 전공 추가하기
            </button>
          )}
        </section>

        <section className="mt-7">
          <label className="block mb-3 text-[16px] font-medium text-gray-900">
            학적 상태 <span className="text-error">*</span>
          </label>

          <SelectField
            value={academicStatus}
            placeholder="학적 상태를 선택해주세요"
            onClick={() => setActiveSheet("academicStatus")}
          />
        </section>

        <section className="mt-7">
          <label className="block mb-3 text-[16px] font-medium text-gray-900">
            관심 분야 <span className="text-error">*</span>
          </label>

          <div
            className="
      flex items-start
      w-full min-h-[52px]
      rounded-[12px]
      bg-gray-200
    "
          >
            {interests.length === 0 ? (
              <button
                type="button"
                onClick={() => setActiveSheet("interests")}
                className="
          flex items-center justify-between
          w-full h-[52px] px-5
          cursor-pointer
        "
              >
                <span className="text-[16px] text-[#ADB5BD]">
                  관심분야를 선택해주세요(최대 4개)
                </span>

                <img
                  src={arrowDown}
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 shrink-0"
                />
              </button>
            ) : (
              <div className="flex flex-1 gap-3 p-4">
                <div className="flex flex-1 min-w-0 flex-col items-start gap-3">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="
                inline-flex items-center gap-2
                max-w-full
                rounded-lg bg-white
                px-3 py-2
                text-[14px] text-gray-900
              "
                    >
                      {interest}

                      <button
                        type="button"
                        aria-label={`${interest} 삭제`}
                        onClick={() =>
                          setInterests((prev) =>
                            prev.filter((item) => item !== interest),
                          )
                        }
                        className="
                  flex shrink-0
                  items-center justify-center
                  w-5 h-5
                  cursor-pointer
                "
                      >
                        <img
                          src={deleteOrange}
                          alt=""
                          aria-hidden="true"
                          className="w-4 h-4"
                        />
                      </button>
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSheet("interests")}
                  aria-label="관심 분야 수정"
                  className="
            flex shrink-0
            items-start justify-center
            w-7 h-7
            cursor-pointer
          "
                >
                  <img
                    src={arrowDown}
                    alt=""
                    aria-hidden="true"
                    className="w-7 h-7"
                  />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomButton text="다음" onClick={handleNext} disabled={!isValid} />

      {sheetConfig && (
        <BottomSheet
          key={activeSheet}
          isOpen={activeSheet !== null}
          onClose={() => setActiveSheet(null)}
          {...sheetConfig}
        />
      )}
    </main>
  );
};

export default ProfileInfoPage;
