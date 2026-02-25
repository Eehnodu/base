import CheckArea from "./checkArea";

const CheckComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">체크 박스 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <CheckArea />
      </div>
    </>
  );
};

export default CheckComponent;
