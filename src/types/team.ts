export type TeamRecruitPost = {
  teamId: number;
  title: string;
  startAt: Date;
  endAt: Date;
  maxMember: number;
  remainingMember: number;
  userName: string;
  studentStatus: string;
  department: string;
  category: 'COURSE' | 'CONTEST_COMPETITION' | 'STUDY' | 'OTHER';
  teamStatus: 'RECRUITING' | 'CLOSED';
};
