import ModalArea from "./modalArea";

const ModalComponent = () => {
  return (
    <>
      <section className="w-1/3 p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-6 h-fit">
        <div className="relative w-full flex items-center justify-center">
          <span className="text-xl font-bold">모달 컴포넌트</span>
        </div>
        <div className="flex flex-col w-full gap-10 justify-center">
          <ModalArea />
        </div>
      </section>
    </>
  );
};

export default ModalComponent;
