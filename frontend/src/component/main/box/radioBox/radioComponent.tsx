import RadioArea from "./radioArea";

const RadioComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">라디오 박스 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <RadioArea />
      </div>
    </>
  );
};

export default RadioComponent;
