import { useQuery } from '@tanstack/react-query';
import { getEventRecommend } from '../../apis/events';

function useGetTodayEventRecommend() {
  return useQuery({
    queryKey: ['getEventRecommend', new Date().toISOString().split('T')[0]],
    queryFn: () => getEventRecommend(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24시간
    retry: 1,
    select: (data) => data.data,
  });
}

export default useGetTodayEventRecommend;
