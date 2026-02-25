import TextArea from "./textArea";

const TextAreaComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">텍스트 에리아 박스 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <TextArea />
      </div>
    </>
  );
};

export default TextAreaComponent;
