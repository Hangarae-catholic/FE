import { useState } from "react";

import BottomSheet from "../components/common/BottomSheet/BottomSheet";
import magnifier from "../assets/icons/magnifier.svg";

type SheetType = "major" | "interest" | "calendar" | "place" | null;

const majorOptions = [
  "경영대학",
  "바이오헬스융합대학",
  "AI전자정보융합대학",
  "약학대학",
  "인문사회계열",
  "자연공학계열",
];

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

const calendarTypes = ["전체", "일반", "학과·학사", "장학", "취창업", "공모전"];

const places = [
  "김수환관(K)",
  "국제관(IH)",
  "스테파노(K)",
  "니콜스관(N)",
  "비르투스관(V)",
  "밤비노관(BA)",
  "마리아관(M)",
  "학생미래인재관(B)",
  "미카엘관(H)(T)",
  "베리타스관(중앙도서관)(L)",
  "성심관(SH)",
  "콘서트홀(CH)",
  "예수성심성당(C)",
  "대운동장",
];

const BottomSheetTestPage = () => {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const [major, setMajor] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const [calendarType, setCalendarType] = useState("전체");
  const [calendarCollege, setCalendarCollege] = useState("전체");

  const [selectedPlace, setSelectedPlace] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [customPlace, setCustomPlace] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const closeSheet = () => setActiveSheet(null);

  const filteredPlaces = places.filter((place) =>
    place.toLowerCase().includes(placeSearch.trim().toLowerCase()),
  );

  const isDirectInput = selectedPlace === "직접 입력";

  const handlePlaceComplete = () => {
    if (!selectedPlace) return;

    if (isDirectInput && !customPlace.trim()) return;

    const finalPlace = isDirectInput ? customPlace.trim() : selectedPlace;

    // TODO: 실제 행사 등록 폼과 연결
    console.log({
      place: finalPlace,
      detailAddress: detailAddress.trim(),
    });

    closeSheet();
  };

  return (
    <main className="min-h-dvh bg-bg px-5 pt-24 font-pretendard">
      <h1 className="text-2xl font-bold text-gray-900">BottomSheet 테스트</h1>

      <p className="mt-2 text-sm text-gray-600">
        각 버튼을 눌러 바텀시트 동작을 확인해보세요.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {(
          [
            ["major", "전공 계열 선택"],
            ["interest", "관심 분야 선택"],
            ["calendar", "캘린더 필터"],
            ["place", "행사 위치 선택"],
          ] as const
        ).map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveSheet(type)}
            className="
              h-[52px] rounded-xl
              bg-gray-200 text-gray-900
              font-medium cursor-pointer
            "
          >
            {label}
          </button>
        ))}
      </div>

      {/* 1. 전공 계열 선택 */}
      <BottomSheet
        isOpen={activeSheet === "major"}
        onClose={closeSheet}
        title="제1전공 계열 선택"
        options={majorOptions}
        selected={major}
        onChange={setMajor}
        searchable
        searchPlaceholder="계열을 검색해주세요"
      />

      {/* 2. 관심 분야 선택 */}
      <BottomSheet
        isOpen={activeSheet === "interest"}
        onClose={closeSheet}
        title="관심 분야 선택"
        description={
          "관심있거나 진로로 하는 분야를 알려주세요\n(최대 4개까지 선택 가능)"
        }
        options={interestOptions}
        selected={interests}
        onChange={setInterests}
        multiple
        maxSelections={4}
        searchable
        searchPlaceholder="관심 분야를 검색해보세요"
        columns={2}
      />

      {/* 3. 캘린더 필터 */}
      <BottomSheet
        isOpen={activeSheet === "calendar"}
        onClose={closeSheet}
        title="캘린더 필터"
        footer={
          <button
            type="button"
            onClick={closeSheet}
            className="
              w-full h-[52px]
              rounded-xl bg-main
              text-white font-semibold
              cursor-pointer
            "
          >
            적용
          </button>
        }
      >
        <div className="flex flex-col gap-6">
          <section>
            <h3 className="mb-4 text-[16px] font-semibold text-[#343A40]">
              유형
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {calendarTypes.map((type) => {
                const isSelected = calendarType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCalendarType(type)}
                    aria-pressed={isSelected}
                    className={`
                      flex items-center justify-center
                      w-full min-w-0 h-[40px]
                      px-1
                      rounded-[10px]
                      border
                      text-[14px] font-normal
                      whitespace-nowrap
                      cursor-pointer
                      ${
                        isSelected
                          ? "border-[#F36B0A] bg-[#FFEAD7] text-[#F36B0A]"
                          : "border-transparent bg-[#E9ECEF] text-[#5C636A]"
                      }
                    `}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[16px] font-semibold text-gray-900">
              학과 계열
            </h3>

            <div className="flex flex-col gap-1">
              {["전체", ...majorOptions].map((college) => {
                const isSelected = calendarCollege === college;

                return (
                  <button
                    key={college}
                    type="button"
                    onClick={() => setCalendarCollege(college)}
                    aria-pressed={isSelected}
                    className="
                      flex items-center gap-3
                      w-full min-h-[46px] py-2
                      text-left cursor-pointer
                    "
                  >
                    <span
                      className={`
                        flex items-center justify-center
                        w-6 h-6 min-w-6 shrink-0
                        rounded-full border-2
                        ${
                          isSelected
                            ? "border-main bg-main"
                            : "border-[#CED4DA] bg-white"
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </span>

                    <span className="min-w-0 text-[16px] text-gray-900">
                      {college}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </BottomSheet>

      {/* 4. 행사 위치 선택 */}
      <BottomSheet
        isOpen={activeSheet === "place"}
        onClose={closeSheet}
        title="행사 위치 선택"
        initialHeight={0.55}
        footer={
          <div className="flex flex-col gap-3">
            <label className="text-[14px] font-medium text-gray-900">
              상세 주소
              <input
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="예) 202호, 야외 무대 앞"
                className="
                  mt-2 w-full h-[52px]
                  px-4 rounded-xl
                  border border-gray-300
                  bg-white
                  text-[16px] font-normal
                  placeholder:text-[#868E96]
                  outline-none
                "
              />
            </label>

            <button
              type="button"
              onClick={handlePlaceComplete}
              disabled={
                !selectedPlace || (isDirectInput && !customPlace.trim())
              }
              className="
                w-full h-[52px]
                rounded-xl bg-main
                text-white font-semibold
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              완료
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div
            className="
              flex items-center gap-3
              w-full h-[52px]
              px-5
              rounded-[12px]
              bg-gray-200
            "
          >
            <img
              src={magnifier}
              alt=""
              className="
            w-6 h-6
          "
            />

            <input
              type="search"
              value={placeSearch}
              onChange={(e) => setPlaceSearch(e.target.value)}
              placeholder="장소를 검색해주세요"
              aria-label="장소 검색"
              className="
                w-full min-w-0
                bg-transparent
                text-[16px] text-gray-900
                placeholder:text-[#ADB5BD]
                outline-none
              "
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSelectedPlace("직접 입력")}
              aria-pressed={isDirectInput}
              className="
                flex items-center gap-3
                w-full min-h-[46px]
                py-2 text-left cursor-pointer
              "
            >
              <span
                className={`
                  flex shrink-0 items-center justify-center
                  w-6 h-6 rounded-full border-2
                  ${
                    isDirectInput
                      ? "border-main bg-main"
                      : "border-[#CED4DA] bg-white"
                  }
                `}
              >
                {isDirectInput && (
                  <span className="w-3 h-3 rounded-full bg-white" />
                )}
              </span>

              <span className="text-[16px] text-gray-900">직접 입력</span>
            </button>

            <input
              type="text"
              value={customPlace}
              onFocus={() => setSelectedPlace("직접 입력")}
              onChange={(e) => {
                setCustomPlace(e.target.value);
                setSelectedPlace("직접 입력");
              }}
              placeholder="예) 니콜스관, 스머프동산"
              aria-label="장소 직접 입력"
              className="
                mt-2 w-full h-[52px]
                px-4 rounded-xl
                border border-gray-300
                bg-white
                text-[16px]
                placeholder:text-[#868E96]
                outline-none
              "
            />
          </div>

          <div className="flex flex-col">
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlace === place;

              return (
                <button
                  key={place}
                  type="button"
                  onClick={() => setSelectedPlace(place)}
                  aria-pressed={isSelected}
                  className="
                    flex items-center gap-3
                    w-full min-h-[46px]
                    py-2 text-left cursor-pointer
                  "
                >
                  <span
                    className={`
                      flex shrink-0 items-center justify-center
                      w-6 h-6 rounded-full border-2
                      ${
                        isSelected
                          ? "border-main bg-main"
                          : "border-[#CED4DA] bg-white"
                      }
                    `}
                  >
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </span>

                  <span className="text-[16px] text-gray-900">{place}</span>
                </button>
              );
            })}

            {filteredPlaces.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-600">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        </div>
      </BottomSheet>
    </main>
  );
};

export default BottomSheetTestPage;
