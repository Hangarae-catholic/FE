import ProfileChip from './ProfileChip';

interface ProfileCardProps {
  interests: string[];
}

export default function ProfileCard({ interests }: ProfileCardProps) {
  return (
    <div className='px-4 py-3 rounded-[18px] bg-gray-50 h-29'>
      <div className='flex items-center gap-1.5'>
        <span className='font-pretendard font-semibold text-base text-gray-800'>아이브</span>
        <span className='font-pretendard font-normal text-sm text-gray-700'>미디어기술콘텐츠학부 4학년</span>
      </div>
      {interests && interests.length > 0 && (
        <div className='flex flex-wrap'>
          {interests.map((i, idx) => (
            <ProfileChip name={i} key={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
