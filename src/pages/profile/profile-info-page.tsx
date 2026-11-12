import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import ProgressBar from "../../components/common/ProgressBar";
import BottomSheet from "../../components/common/BottomSheet/BottomSheet";
import arrowDown from "../../assets/icons/arrow_down.svg";
import deleteOrange from "../../assets/icons/delete-orange.svg";
import { Department } from "../../constants/DEPARTMENT";
import { Division } from "../../constants/DIVISION";
import { Interest } from "../../constants/INTEREST";
import { STUDENT_STATUS } from "../../constants/STUDENT_STATUS";

type SheetType =
  | "primaryCollege"
  | "primaryDepartment"
  | "secondaryCollege"
  | "secondaryDepartment"
  | "minorCollege"
  | "minorDepartment"
  | "academicStatus"
  | "interests";

const departmentIdsByDivision: Record<string, string[]> = {
  BUSINESS: ["BUSINESS_ADMINISTRATION", "ACCOUNTING"],
  GLOBAL_BUSINESS_SCHOOL: [
    "INTERNATIONAL_BUSINESS",
    "TAX_ACCOUNTING_FINANCE",
    "IT_FINANCE",
  ],
  BIO_HEALTH_CONVERGENCE: [
    "BIOTECHNOLOGY",
    "BIOMEDICAL_CHEMICAL_ENGINEERING",
    "BIOLOGICS_ENGINEERING",
    "AI_BIOMEDICAL_ENGINEERING",
    "BIOMEDICAL_SCIENCE",
    "BIOMEDICAL_SOFTWARE",
  ],
  AI_ELECTRONICS_INFORMATION_CONVERGENCE: [
    "COMPUTER_INFORMATION_ENGINEERING",
    "MEDIA_TECHNOLOGY_CONTENTS",
    "INFORMATION_COMMUNICATION_ELECTRONICS_ENGINEERING",
    "ARTIFICIAL_INTELLIGENCE",
    "DATA_SCIENCE",
  ],
  PHARMACY: ["PHARMACY"],
  HUMANITIES: ["KOREAN_LANGUAGE_LITERATURE", "PHILOSOPHY", "KOREAN_HISTORY"],
  LANGUAGES: [
    "ENGLISH_LANGUAGE_LITERATURE",
    "CHINESE_LANGUAGE_CULTURE",
    "JAPANESE_LANGUAGE_CULTURE",
    "FRENCH_CULTURE",
  ],
  SOCIAL_SCIENCES: [
    "SOCIAL_WELFARE",
    "PSYCHOLOGY",
    "SOCIOLOGY",
    "CHILD_STUDIES",
  ],
  SPECIAL_EDUCATION: ["SPECIAL_EDUCATION"],
  INTERNATIONAL_LAW_ECONOMICS: [
    "INTERNATIONAL_STUDIES",
    "LAW",
    "ECONOMICS",
    "PUBLIC_ADMINISTRATION",
  ],
  GLOBAL_BUSINESS: ["GLOBAL_BUSINESS"],
  NATURAL_SCIENCES: ["CHEMISTRY", "MATHEMATICS", "PHYSICS"],
  ENGINEERING: ["ENERGY_ENVIRONMENTAL_ENGINEERING"],
  HUMAN_ECOLOGY: [
    "SPATIAL_DESIGN_CONSUMER_STUDIES",
    "CLOTHING_TEXTILES",
    "FOOD_NUTRITION",
  ],
  MUSIC: ["MUSIC"],
  APPLIED_ARTS: ["ART_MEDIA_CONVERGENCE"],
  TEACHER_TRAINING: ["TEACHER_TRAINING"],
  LIBERAL_STUDIES: ["LIBERAL_STUDIES"],
  INTERDISCIPLINARY_STUDIES: ["INTERDISCIPLINARY_STUDIES"],
};

const collegeOptions = Division.map((item) => item.name);
const interestOptions = Interest.map((item) => item.name);

const getDepartmentOptions = (divisionName: string): string[] => {
  const divisionId = Division.find((item) => item.name === divisionName)?.id;
  if (!divisionId) return [];
  const allowed = new Set(departmentIdsByDivision[divisionId] ?? []);
  return Department.filter((item) => allowed.has(item.id)).map(
    (item) => item.name,
  );
};

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

  const [hasMinor, setHasMinor] = useState(false);
  const [minorCollege, setMinorCollege] = useState("");
  const [minorDepartment, setMinorDepartment] = useState("");

  const [academicStatus, setAcademicStatus] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);

  const isValid =
    !!primaryCollege &&
    !!primaryDepartment &&
    !!academicStatus &&
    interests.length > 0 &&
    (!hasSecondMajor || (!!secondaryCollege && !!secondaryDepartment)) &&
    (!hasMinor || (!!minorCollege && !!minorDepartment));

  const handleRemoveSecondMajor = () => {
    setHasSecondMajor(false);
    setSecondaryCollege("");
    setSecondaryDepartment("");
  };

  const handleRemoveMinor = () => {
    setHasMinor(false);
    setMinorCollege("");
    setMinorDepartment("");
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
        minorCollege: hasMinor ? minorCollege : null,
        minorDepartment: hasMinor ? minorDepartment : null,
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
          options: getDepartmentOptions(primaryCollege),
          selected: [primaryDepartment],
          searchable: true,
          searchPlaceholder: "학과를 검색해주세요",
          onChange: (values: string[]) => setPrimaryDepartment(values[0] ?? ""),
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
          options: getDepartmentOptions(secondaryCollege),
          selected: [secondaryDepartment],
          searchable: true,
          searchPlaceholder: "학과를 검색해주세요",
          onChange: (values: string[]) =>
            setSecondaryDepartment(values[0] ?? ""),
        };
      case "minorCollege":
        return {
          title: "부전공 계열 선택",
          options: collegeOptions,
          selected: [minorCollege],
          searchable: true,
          searchPlaceholder: "계열을 검색해주세요",
          onChange: (values: string[]) => {
            setMinorCollege(values[0] ?? "");
            setMinorDepartment("");
          },
        };
      case "minorDepartment":
        return {
          title: "부전공 학과 선택",
          options: getDepartmentOptions(minorCollege),
          selected: [minorDepartment],
          searchable: true,
          searchPlaceholder: "학과를 검색해주세요",
          onChange: (values: string[]) => setMinorDepartment(values[0] ?? ""),
        };
      case "academicStatus":
        return {
          title: "학적 상태 선택",
          options: STUDENT_STATUS.map((status) => status.name),
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
          onChange: (values: string[]) => setInterests(values),
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-medium text-gray-900">
              부전공 <span className="text-gray-600">(선택)</span>
            </h2>
            {hasMinor && (
              <button
                type="button"
                onClick={handleRemoveMinor}
                className="text-[14px] text-gray-600 underline underline-offset-4 cursor-pointer"
              >
                삭제
              </button>
            )}
          </div>

          {hasMinor ? (
            <div className="flex flex-col gap-3">
              <SelectField
                value={minorCollege}
                placeholder="계열을 선택해주세요"
                onClick={() => setActiveSheet("minorCollege")}
              />
              <SelectField
                value={minorDepartment}
                placeholder="학과를 선택해주세요"
                disabled={!minorCollege}
                onClick={() => setActiveSheet("minorDepartment")}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHasMinor(true)}
              className="flex items-center justify-center gap-4 w-full h-[52px] rounded-[12px] border border-[#CED4DA] text-gray-700 text-[16px] font-medium cursor-pointer"
            >
              <span className="text-[24px] font-normal leading-none">+</span>
              부전공 추가하기
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
