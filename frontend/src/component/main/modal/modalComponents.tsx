import FormModalComponent from "./formModal/formModalComponent";
import ModalComponent from "./modal/modalComponent";

const ModalComponents = () => {
  return (
    <>
      <title>컴포넌트: 모달</title>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">모달 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <FormModalComponent />
        <ModalComponent />
      </div>
    </>
  );
};

export default ModalComponents;
