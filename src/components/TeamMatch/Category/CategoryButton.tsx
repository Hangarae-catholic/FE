interface CategoryButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const CategoryButton = ({ label, selected, onClick }: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center font-pretendard px-3 py-1 rounded-3xl text-[13px] font-normal border border-orange-300
        ${selected ? 'bg-main text-white font-semibold' : 'bg-white text-gray-800'}
        transition-colors duration-200`}
    >
      <span>{label}</span>
    </button>
  );
};

export default CategoryButton;
