import { CATEGORIES } from '../../../constants/CATEGORY';
import CategoryButton from './CategoryButton';

interface CategoryGroupProps {
  selected: string;
  setSelected: (type: string) => void;
}

export default function CategoryGroup({ selected, setSelected }: CategoryGroupProps) {
  return (
    <div className='mt-3 overflow-x-auto scrollbar-hide'>
      <div className='flex gap-1.5 whitespace-nowrap px-1 py-3 w-max'>
        {CATEGORIES.map(({ type }) => (
          <CategoryButton key={type} label={type} selected={selected === type} onClick={() => setSelected(type)} />
        ))}
      </div>
    </div>
  );
}
