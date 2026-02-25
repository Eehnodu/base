import SelectArea from "./selectArea";

const SelectComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">셀랙트 박스 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <SelectArea />
      </div>
    </>
  );
};

export default SelectComponent;
