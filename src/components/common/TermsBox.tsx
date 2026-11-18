import ReactMarkdown from "react-markdown";

interface TermsBoxProps {
  content: string;
}

const TermsBox = ({ content }: TermsBoxProps) => {
  return (
    <div
      className="
        w-full h-[160px]
        overflow-y-auto
        rounded-[12px]
        border border-[#CED4DA]
        bg-white
        px-4 py-4
        font-pretendard
        text-[12px]
        leading-[1.7]
        text-[#5C636A]
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-[#CED4DA]
      "
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-[15px] font-bold text-[#343A40]">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mt-5 mb-3 text-[14px] font-semibold text-[#343A40]">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-[13px] font-semibold text-[#343A40]">
              {children}
            </h3>
          ),

          p: ({ children }) => <p className="mb-3 leading-[1.7]">{children}</p>,

          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-2 pl-5">{children}</ol>
          ),

          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-2 pl-5">{children}</ul>
          ),

          li: ({ children }) => (
            <li className="pl-1 leading-[1.7]">{children}</li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-[#343A40]">{children}</strong>
          ),

          hr: () => <hr className="my-5 border-[#DEE2E6]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default TermsBox;
