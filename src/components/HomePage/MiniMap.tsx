import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import Map from '/src/assets/images/map.png';

interface ImageSize {
  width: number;
  height: number;
}

export default function MiniMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageSize, setImageSize] = useState<ImageSize | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    const updateImageSize = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // 화면을 빈 공간 없이 채우기 위한 확대 비율
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

  return (
    <div ref={containerRef} className='absolute inset-0 overflow-hidden bg-gray-100'>
      {/* 이미지 크기를 측정하기 위한 원본 이미지 */}
      <img
        ref={imageRef}
        src={Map}
        alt='지도'
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
        <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit limitToBounds wheel={{ step: 0.1 }} pinch={{ disabled: false }} doubleClick={{ disabled: false }} panning={{ disabled: false }}>
          <TransformComponent wrapperClass='!h-full !w-full' contentClass='!w-fit !h-fit !max-w-none'>
            <img
              src={Map}
              alt='지도'
              draggable={false}
              className='block max-w-none select-none'
              style={{
                width: imageSize.width,
                height: imageSize.height,
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
}
