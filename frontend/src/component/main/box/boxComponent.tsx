import CheckComponent from "./checkBox/checkComponent";
import RadioComponent from "./radioBox/radioComponent";
import SelectComponent from "./selectBox/selectComponent";

const BoxComponent = () => {
  return (
    <>
      <title>컴포넌트: 박스</title>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-2xl font-bold">박스 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full justify-center gap-10">
        <div className="flex flex-col w-1/4 gap-6">
          <SelectComponent />
        </div>
        <div className="flex flex-col w-1/4 gap-6">
          <RadioComponent />
        </div>
        <div className="flex flex-col w-1/4 gap-6">
          <CheckComponent />
        </div>
      </div>
    </>
  );
};

export default BoxComponent;
