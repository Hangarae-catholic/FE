import { Department } from '../../constants/DEPARTMENT';
import { Interest as INTERESTS } from '../../constants/INTEREST';
import { STUDENT_STATUS } from '../../constants/STUDENT_STATUS';
import { UserStore } from '../../store/UserStore';
import type { Interest } from '../../types/user';
import ProfileChip from './ProfileChip';

interface ProfileCardProps {
  interests: Interest[] | undefined;
}

export default function ProfileCard({ interests }: ProfileCardProps) {
  const userNickname = UserStore.getState().user?.nickname;
  const userStatus = STUDENT_STATUS.find((ss) => ss.id === UserStore.getState().user?.status)?.name;
  const userDepartment = Department.find((d) => String(d.id) === String(UserStore.getState().user?.departments?.[0].name))?.name;

  return (
    <div className='px-4 py-3 rounded-[18px] bg-gray-50 h-29 break-keep'>
      <div className='flex items-center gap-1.5'>
        <span className='font-pretendard font-semibold text-base text-gray-800'>{userNickname}</span>
        <span className='font-pretendard font-normal text-sm text-gray-700'>
          {userDepartment} {userStatus}
        </span>
      </div>
      {interests && interests.length > 0 && (
        <div className='flex flex-wrap'>
          {interests.map((i, idx) => (
            <ProfileChip name={INTERESTS.find((interest) => interest.id === i.name)?.name} key={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
