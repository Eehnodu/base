import ToggleArea from "./toggleArea";

const ToggleComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-2xl font-bold">토글 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <ToggleArea />
      </div>
    </>
  );
};

export default ToggleComponent;
