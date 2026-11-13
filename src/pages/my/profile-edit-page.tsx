import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CHARACTERS, type CharacterType } from "../../constants/CHARACTER";
import { Department } from "../../constants/DEPARTMENT";
import { Division } from "../../constants/DIVISION";
import { Interest } from "../../constants/INTEREST";
import { STUDENT_STATUS } from "../../constants/STUDENT_STATUS";
import { AuthStore } from "../../store/AuthStore";
import { UserStore } from "../../store/UserStore";
import { getProfile, updateProfile } from "../../apis/user";
import type { UserData, UpdateProfileRequest } from "../../types/user";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import BottomSheet from "../../components/common/BottomSheet/BottomSheet";
import Modal from "../../components/common/Modal";

import arrowDown from "../../assets/icons/arrow_down.svg";
import deleteOrange from "../../assets/icons/delete-orange.svg";
import check from "../../assets/icons/check.svg";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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

const colleges = Division.map((item) => item.name);
const academicStatuses = STUDENT_STATUS.map((item) => item.name);
const interestOptions = Interest.map((item) => item.name);

const getDepartmentOptions = (collegeName: string): string[] => {
  const divisionId = Division.find((item) => item.name === collegeName)?.id;
  if (!divisionId) return [];
  const allowedIds = new Set(departmentIdsByDivision[divisionId] ?? []);
  return Department.filter((item) => allowedIds.has(item.id)).map(
    (item) => item.name,
  );
};

const nameToId = (
  items: readonly { id: string; name: string }[],
  name: string,
): string => items.find((item) => item.name === name)?.id ?? "";
const idToName = (
  items: readonly { id: string; name: string }[],
  id: string,
): string => items.find((item) => item.id === id)?.name ?? id;
const collegeForDivision = (divisionId: string): string =>
  idToName(Division, divisionId);
const getDepartmentId = (name: string): string => nameToId(Department, name);

const characterKeyFromApi = (value: string): CharacterType => {
  const result = (
    Object.entries(CHARACTERS) as [
      CharacterType,
      (typeof CHARACTERS)[CharacterType],
    ][]
  ).find(([key, character]) => key === value || character.apiValue === value);
  return result?.[0] ?? "THUMBS_UP";
};

interface ProfileForm {
  nickname: string;
  character: CharacterType;
  primaryCollege: string;
  primaryDepartment: string;
  doubleMajorCollege: string;
  doubleMajorDepartment: string;
  minorCollege: string;
  minorDepartment: string;
  academicStatus: string;
  interests: string[];
}

const emptyProfile: ProfileForm = {
  nickname: "",
  character: "THUMBS_UP",
  primaryCollege: "",
  primaryDepartment: "",
  doubleMajorCollege: "",
  doubleMajorDepartment: "",
  minorCollege: "",
  minorDepartment: "",
  academicStatus: "",
  interests: [],
};

const toForm = (user: UserData): ProfileForm => {
  const primary = user.departments?.find((dept) => dept.type === "PRIMARY");
  const minor = user.departments?.find((dept) => dept.type === "MINOR");
  const doubleMajor = user.departments?.find(
    (dept) => !["PRIMARY", "MINOR"].includes(dept.type),
  );
  return {
    nickname: user.nickname ?? "",
    character: characterKeyFromApi(user.character),
    primaryCollege: primary ? collegeForDivision(primary.division) : "",
    primaryDepartment: primary ? idToName(Department, primary.name) : "",
    doubleMajorCollege: doubleMajor
      ? collegeForDivision(doubleMajor.division)
      : "",
    doubleMajorDepartment: doubleMajor
      ? idToName(Department, doubleMajor.name)
      : "",
    minorCollege: minor ? collegeForDivision(minor.division) : "",
    minorDepartment: minor ? idToName(Department, minor.name) : "",
    academicStatus: idToName(STUDENT_STATUS, user.status),
    interests: (user.interests ?? []).map((item) =>
      idToName(Interest, item.name),
    ),
  };
};

type SheetType =
  | "primaryCollege"
  | "primaryDepartment"
  | "doubleMajorCollege"
  | "doubleMajorDepartment"
  | "minorCollege"
  | "minorDepartment"
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

  const accessToken = AuthStore((state) => state.accessToken);
  const setUser = UserStore((state) => state.setUser);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState<ProfileForm | null>(
    null,
  );
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [hasDoubleMajor, setHasDoubleMajor] = useState(false);
  const [hasMinor, setHasMinor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!accessToken) {
        setErrorMessage("로그인 정보가 없습니다. 다시 로그인해주세요.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await getProfile(accessToken);
        if (!response.data) throw new Error("프로필 조회 결과가 없습니다.");
        if (cancelled) return;
        const loaded = toForm(response.data);
        setProfile(loaded);
        setOriginalProfile(loaded);
        setHasDoubleMajor(Boolean(loaded.doubleMajorDepartment));
        setHasMinor(Boolean(loaded.minorDepartment));
        setUser(response.data);
      } catch (error) {
        if (cancelled) return;
        console.error("프로필 조회 실패:", error);
        setErrorMessage("프로필 정보를 불러오지 못했어요. 다시 진입해주세요.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [accessToken, setUser]);

  const updateMyProfile = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isChanged = Boolean(
    originalProfile &&
    (JSON.stringify(profile) !== JSON.stringify(originalProfile) ||
      hasDoubleMajor !== Boolean(originalProfile.doubleMajorDepartment) ||
      hasMinor !== Boolean(originalProfile.minorDepartment)),
  );

  const isValid =
    !isLoading &&
    Boolean(originalProfile) &&
    profile.nickname.trim().length > 0 &&
    profile.primaryCollege !== "" &&
    profile.primaryDepartment !== "" &&
    profile.academicStatus !== "" &&
    profile.interests.length > 0 &&
    profile.interests.length <= 4 &&
    (!hasDoubleMajor ||
      Boolean(profile.doubleMajorCollege && profile.doubleMajorDepartment)) &&
    (!hasMinor || Boolean(profile.minorCollege && profile.minorDepartment));

  const handleBack = () => {
    if (isChanged) {
      setIsCancelModalOpen(true);
      return;
    }

    navigate(-1);
  };

  const handleSave = async () => {
    if (!isValid || isSaving || !accessToken) return;
    const primaryId = getDepartmentId(profile.primaryDepartment);
    const doubleId = hasDoubleMajor
      ? getDepartmentId(profile.doubleMajorDepartment)
      : null;
    const minorId = hasMinor ? getDepartmentId(profile.minorDepartment) : null;
    const statusId = nameToId(STUDENT_STATUS, profile.academicStatus);
    const interestIds = profile.interests.map((item) =>
      nameToId(Interest, item),
    );
    if (
      !primaryId ||
      !statusId ||
      interestIds.some((id) => !id) ||
      (hasDoubleMajor && !doubleId) ||
      (hasMinor && !minorId)
    ) {
      setErrorMessage("선택한 전공, 학적 또는 관심 분야 값을 확인해주세요.");
      return;
    }
    const body: UpdateProfileRequest = {
      nickname: profile.nickname.trim(),
      character: CHARACTERS[profile.character].apiValue,
      status: statusId,
      primaryDepartment: primaryId,
      doubleMajorDepartment: doubleId,
      minorDepartment: minorId,
      interests: interestIds,
    };
    setIsSaving(true);
    setErrorMessage("");
    try {
      const response = await updateProfile(body, accessToken);
      if (!response.data)
        throw new Error("프로필 수정 응답 데이터가 없습니다.");
      setUser(response.data);
      navigate("/my", { replace: true });
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setErrorMessage(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "프로필 수정에 실패했습니다.")
          : "프로필 수정에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDoubleMajor = () => {
    setHasDoubleMajor(false);

    setProfile((prev) => ({
      ...prev,
      doubleMajorCollege: "",
      doubleMajorDepartment: "",
    }));
  };

  const handleDeleteMinor = () => {
    setHasMinor(false);
    setProfile((prev) => ({ ...prev, minorCollege: "", minorDepartment: "" }));
  };

  const handleRemoveInterest = (interest: string) => {
    updateMyProfile(
      "interests",
      profile.interests.filter((item) => item !== interest),
    );
  };

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
          options: getDepartmentOptions(profile.primaryCollege),
          selected: [profile.primaryDepartment],
          onChange: (values: string[]) => {
            updateMyProfile("primaryDepartment", values[0] ?? "");
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
          options: getDepartmentOptions(profile.doubleMajorCollege),
          selected: [profile.doubleMajorDepartment],
          onChange: (values: string[]) => {
            updateMyProfile("doubleMajorDepartment", values[0] ?? "");
          },
        };

      case "minorCollege":
        return {
          title: "부전공 계열 선택",
          options: colleges,
          selected: [profile.minorCollege],
          onChange: (values: string[]) => {
            setProfile((prev) => ({
              ...prev,
              minorCollege: values[0] ?? "",
              minorDepartment: "",
            }));
          },
        };
      case "minorDepartment":
        return {
          title: "부전공 학과 선택",
          options: getDepartmentOptions(profile.minorCollege),
          selected: [profile.minorDepartment],
          onChange: (values: string[]) =>
            updateMyProfile("minorDepartment", values[0] ?? ""),
        };
      case "academicStatus":
        return {
          title: "학적 상태 선택",
          options: academicStatuses,
          selected: [profile.academicStatus],
          onChange: (values: string[]) => {
            updateMyProfile("academicStatus", values[0] ?? "");
          },
        };

      case "interests":
        return {
          title: "관심 분야 선택",
          options: interestOptions,
          selected: profile.interests,
          onChange: (values: string[]) => {
            updateMyProfile("interests", values);
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
      {errorMessage && (
        <p role="alert" className="px-5 pt-4 text-sm text-error">
          {errorMessage}
        </p>
      )}

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
            onChange={(e) => updateMyProfile("nickname", e.target.value)}
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
                  onClick={() => updateMyProfile("character", type)}
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

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-medium text-[#343A40]">
              부전공 (선택)
            </h2>
            {hasMinor && (
              <button
                type="button"
                onClick={handleDeleteMinor}
                className="text-[14px] text-[#6C757D] underline cursor-pointer"
              >
                삭제
              </button>
            )}
          </div>
          {hasMinor ? (
            <div className="flex flex-col gap-3">
              <SelectField
                value={profile.minorCollege}
                placeholder="부전공 계열 선택"
                onClick={() => setActiveSheet("minorCollege")}
              />
              <SelectField
                value={profile.minorDepartment}
                placeholder="부전공 학과 선택"
                onClick={() =>
                  setActiveSheet(
                    profile.minorCollege ? "minorDepartment" : "minorCollege",
                  )
                }
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHasMinor(true)}
              className="flex items-center justify-center gap-3 w-full h-[52px] rounded-[12px] border border-[#DEE2E6] text-[16px] text-[#6C757D] cursor-pointer"
            >
              <span className="text-[24px] leading-none">+</span>부전공 추가하기
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

      <BottomButton
        text="저장"
        onClick={handleSave}
        disabled={!isValid || isSaving || !isChanged}
      />

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
            activeSheet === "minorDepartment" ||
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
