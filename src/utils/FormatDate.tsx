import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date: Date | undefined): string | undefined => {
  if (!date) return;

  return format(new Date(date), 'M월 d일(eee) HH시', {
    locale: ko,
  });
};
