interface ProfileChipProps {
  name: string | undefined;
}

export default function ProfileChip({ name }: ProfileChipProps) {
  return <div className='font-pretendard font-normal text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-xl mr-1.5 mt-2'>{name}</div>;
}
