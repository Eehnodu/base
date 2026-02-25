import ButtonArea from "./buttonArea";

const ButtonComponent = () => {
  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-2xl font-bold">버튼 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <ButtonArea />
      </div>
    </>
  );
};

export default ButtonComponent;
