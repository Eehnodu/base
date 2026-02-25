import InputArea from "./inputArea";

const InputComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">인풋 에리아 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <InputArea />
      </div>
    </>
  );
};

export default InputComponent;
