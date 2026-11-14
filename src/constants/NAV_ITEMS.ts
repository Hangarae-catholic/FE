import Home from '/src/assets/icons/home.svg?react';
import Calendar from '/src/assets/icons/calendar.svg?react';
import Matching from '/src/assets/icons/matching.svg?react';
import My from '/src/assets/icons/my.svg?react';
import Plus from '/src/assets/icons/plus.svg?react';

export const NAV_ITEMS = [
  {
    path: '/home',
    label: '홈',
    icon: Home,
  },
  {
    path: '/calendar',
    label: '캘린더',
    icon: Calendar,
  },
  {
    icon: Plus,
  },
  {
    path: '/team-match',
    label: '팀매칭',
    icon: Matching,
  },
  {
    path: '/my',
    label: '마이페이지',
    icon: My,
  },
];
