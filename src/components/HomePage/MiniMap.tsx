import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Map from '/src/assets/images/map.png';
import { buildingCoordinates, type BuildingCoordinate } from '../../constants/BUILDING_COORDINATES';
import MapMarker from '/src/assets/icons/map-marker.svg?react';
import type { EventInfo } from '../../types/events';

interface MiniMapProps {
  buildingNames?: string[];
  events: EventInfo[];
  clickMarker?: (buildingName: string) => void;
}

interface ImageSize {
  width: number;
  height: number;
}

export default function MiniMap({ buildingNames = [], clickMarker, events }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);

  // 지도 이미지 크기 계산
  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    const updateImageSize = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // 지도 영역을 빈 공간 없이 채우는 확대 비율
      const scale = Math.max(containerWidth / image.naturalWidth, containerHeight / image.naturalHeight);

      setImageSize({
        width: image.naturalWidth * scale,
        height: image.naturalHeight * scale,
      });
    };

    const observer = new ResizeObserver(updateImageSize);
    observer.observe(container);

    if (image.complete) {
      updateImageSize();
    }

    return () => observer.disconnect();
  }, []);

  // 전달받은 건물명에 해당하는 좌표 찾기
  const selectedBuildings = buildingCoordinates.filter((building: BuildingCoordinate) => buildingNames.includes(building.name));

  // 건물별 행사 개수
  const getEventCount = (buildingId: string) => {
    return events.filter((event) => event.location === buildingId).length;
  };

  return (
    <div ref={containerRef} className='absolute inset-0 overflow-hidden bg-gray-100'>
      {/* 이미지 원본 크기 확인 */}
      <img
        ref={imageRef}
        src={Map}
        alt=''
        className='hidden'
        onLoad={() => {
          const container = containerRef.current;
          const image = imageRef.current;

          if (!container || !image) return;

          const scale = Math.max(container.clientWidth / image.naturalWidth, container.clientHeight / image.naturalHeight);

          setImageSize({
            width: image.naturalWidth * scale,
            height: image.naturalHeight * scale,
          });
        }}
      />

      {imageSize && (
        <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit limitToBounds wheel={{ step: 0.1 }} pinch={{ disabled: false }} panning={{ disabled: false }}>
          <TransformComponent wrapperClass='!h-full !w-full' contentClass='!h-fit !w-fit !max-w-none'>
            {/* 지도 이미지와 마커를 같은 영역에 배치 */}
            <div
              className='relative shrink-0'
              style={{
                width: imageSize.width,
                height: imageSize.height,
              }}
            >
              <img src={Map} alt='행사 지도' draggable={false} className='block h-full w-full select-none' />

              {/* 건물별 마커 */}
              {selectedBuildings.map((building) => {
                const eventCount = getEventCount(building.id);

                if (eventCount === 0) return null;

                return (
                  <div
                    key={building.name}
                    className='absolute z-10 -translate-x-1/2 -translate-y-1/2'
                    style={{
                      left: `${building.x}%`,
                      top: `${building.y}%`,
                    }}
                  >
                    <button type='button' className='relative cursor-pointer' onClick={() => clickMarker?.(building.name)}>
                      <span className='absolute top-4 left-1/2 -translate-x-1/2 font-pretendard font-semibold text-base text-gray-900'>{eventCount}</span>
                      <MapMarker />
                    </button>
                  </div>
                );
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
}
