import { useQuery } from '@tanstack/react-query';
import { getEventRetreive } from '../../apis/events';

function useGetTodayEventLocation() {
  return useQuery({
    queryKey: ['getEventRetreive', new Date().toISOString().split('T')[0]],
    queryFn: () => getEventRetreive(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24시간
    retry: 1,
    select: (data) => data.data,
  });
}

export default useGetTodayEventLocation;
