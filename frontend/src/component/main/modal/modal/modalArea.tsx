import Modal from "@/component/common/feedback/modal";
import Button from "@/component/common/form/button";
import { useState } from "react";

const ModalArea = () => {
  const [isSMOpen, setIsSMOpen] = useState<boolean>(false);
  const [isMDOpen, setIsMDOpen] = useState<boolean>(false);
  const [isLGOpen, setIsLGOpen] = useState<boolean>(false);
  //
  const [is0Open, setIs0Open] = useState<boolean>(false);
  const [is1Open, setIs1Open] = useState<boolean>(false);
  const [is2Open, setIs2Open] = useState<boolean>(false);

  return (
    <>
      <section className="w-full flex flex-col rounded-md gap-10 h-fit">
        <section className="flex flex-col gap-6 border border-[#D3D3D3] rounded-md p-5">
          <div className="w-full flex items-center flex-col">
            <span className="text-lg font-bold">SIZE 별</span>
            <span className="text-sm text-gray-700">
              size에 따라 모달의 최대 너비가 달라집니다.
            </span>
          </div>
          <section className="flex flex-row gap-3">
            <Button variant="sub2" onClick={() => setIsSMOpen(true)}>
              sm
            </Button>
            <Button variant="sub2" onClick={() => setIsMDOpen(true)}>
              md
            </Button>
            <Button variant="sub2" onClick={() => setIsLGOpen(true)}>
              lg
            </Button>
          </section>
        </section>
        <section className="flex flex-col gap-6 border border-[#D3D3D3] rounded-md p-5">
          <div className="w-full flex items-center flex-col">
            <span className="text-lg font-bold">버튼 개수 별</span>
            <span className="text-sm text-gray-700">
              buttonCount에 따라 버튼이 표시됩니다.{" "}
            </span>
          </div>
          <section className="flex flex-row gap-3">
            <Button variant="sub2" onClick={() => setIs0Open(true)}>
              0
            </Button>
            <Button variant="sub2" onClick={() => setIs1Open(true)}>
              1
            </Button>
            <Button variant="sub2" onClick={() => setIs2Open(true)}>
              2
            </Button>
          </section>
        </section>
      </section>
      <Modal
        open={isSMOpen}
        onClose={() => setIsSMOpen(false)}
        size="sm"
        title="사이즈 모달"
        buttonCount={1}
        description={`현재 사이즈는 "sm"입니다. `}
      />
      <Modal
        open={isMDOpen}
        onClose={() => setIsMDOpen(false)}
        size="md"
        title="사이즈 모달"
        buttonCount={1}
        description={`현재 사이즈는 "md"입니다. `}
      />
      <Modal
        open={isLGOpen}
        onClose={() => setIsLGOpen(false)}
        size="lg"
        title="사이즈 모달"
        buttonCount={1}
        description={`현재 사이즈는 "lg"입니다. `}
      />
      <Modal
        open={is0Open}
        onClose={() => setIs0Open(false)}
        title="버튼 개수 예시"
        buttonCount={1}
        description="버튼 개수: 0"
      />
      <Modal
        open={is1Open}
        onClose={() => setIs1Open(false)}
        title="버튼 개수 예시"
        buttonCount={1}
        description="버튼 개수: 1"
      />
      <Modal
        open={is2Open}
        onClose={() => setIs2Open(false)}
        title="버튼 개수 예시"
        buttonCount={2}
        description="버튼 개수: 2"
      />
    </>
  );
};

export default ModalArea;
