import InputComponent from "./input/inputComponent";
import TextAreaComponent from "./textArea/textAreaComponent";

const AreaComponent = () => {
  return (
    <>
      <title>컴포넌트: 에리아</title>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-2xl font-bold">에리아 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full justify-center gap-10">
        <div className="flex flex-col w-1/3 gap-10">
          <TextAreaComponent />
        </div>
        <div className="flex flex-col w-1/3 gap-10">
          <InputComponent />
        </div>
      </div>
    </>
  );
};

export default AreaComponent;
