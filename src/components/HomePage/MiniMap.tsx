import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import Map from '/src/assets/images/map.png';

export default function MiniMap() {
  return (
    <div className='relative h-full w-full overflow-hidden bg-gray-100 rounded-[20px]'>
      <TransformWrapper initialScale={2} minScale={1} maxScale={5} centerOnInit limitToBounds wheel={{ step: 0.1 }} pinch={{ disabled: true }} doubleClick={{ disabled: true }}>
        <TransformComponent wrapperClass='!h-full !w-full' contentClass='!h-full !w-full'>
          <img src={Map} alt='지도' className='block h-full w-full select-none object-contain' draggable={false} />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
