import FormModal from "@/component/common/feedback/formModal";
import Button from "@/component/common/form/button";
import { useState } from "react";

const FormModalArea = () => {
  const [isHeaderLeftOpen, setIsHeaderLeftOpen] = useState<boolean>(false);
  const [isHeaderSMLeftOpen, setIsHeaderSMLeftOpen] = useState<boolean>(false);
  const [isHeaderMDLeftOpen, setIsHeaderMDLeftOpen] = useState<boolean>(false);
  //
  const [isHeaderLGLeftOpen, setIsHeaderLGLeftOpen] = useState<boolean>(false);
  const [isHeaderCenterOpen, setIsHeaderCenterOpen] = useState<boolean>(false);
  const [isHeaderNoneOpen, setIsHeaderNoneOpen] = useState<boolean>(false);
  //
  const [isFooter0Open, setIsFooter0Open] = useState<boolean>(false);
  const [isFooter1Open, setIsFooter1Open] = useState<boolean>(false);
  const [isFooter2LeftOpen, setIsFooter2LeftOpen] = useState<boolean>(false);
  const [isFooter2CenterOpen, setIsFooter2CenterOpen] =
    useState<boolean>(false);
  const [isFooter2RightOpen, setIsFooter2RightOpen] = useState<boolean>(false);

  return (
    <>
      <section className="w-full flex flex-col rounded-md gap-10 h-fit">
        <section className="flex flex-col gap-6 border border-[#D3D3D3] rounded-md p-5">
          <div className="w-full flex items-center flex-col">
            <span className="text-lg font-bold">HEADER 타입 별</span>
            <span className="text-sm text-gray-700">
              headerType에 따라 타이틀/설명이 정렬되거나 숨겨집니다.
            </span>
          </div>
          <section className="flex flex-row gap-3">
            <Button variant="sub2" onClick={() => setIsHeaderLeftOpen(true)}>
              left
            </Button>
            <Button variant="sub2" onClick={() => setIsHeaderCenterOpen(true)}>
              center
            </Button>
            <Button variant="sub2" onClick={() => setIsHeaderNoneOpen(true)}>
              none
            </Button>
          </section>
        </section>
        <section className="flex flex-col gap-6 border border-[#D3D3D3] rounded-md p-5">
          <div className="w-full flex items-center flex-col">
            <span className="text-lg font-bold">SIZE 별</span>
            <span className="text-sm text-gray-700">
              size에 따라 모달의 최대 너비가 달라집니다.
            </span>
          </div>
          <section className="flex flex-row gap-3">
            <Button variant="sub2" onClick={() => setIsHeaderSMLeftOpen(true)}>
              sm
            </Button>
            <Button variant="sub2" onClick={() => setIsHeaderLeftOpen(true)}>
              md
            </Button>
            <Button variant="sub2" onClick={() => setIsHeaderLGLeftOpen(true)}>
              lg
            </Button>
          </section>
        </section>
        <section className="flex flex-col gap-6 border border-[#D3D3D3] rounded-md p-5">
          <div className="w-full flex items-center flex-col">
            <span className="text-lg font-bold">FOOTER 타입 & 정렬</span>
            <span className="text-sm text-gray-700">
              footerType과 footerAlign 조합으로 버튼 개수와 정렬을 제어합니다.
            </span>
          </div>
          <section className="flex flex-row gap-3">
            <Button variant="sub2" onClick={() => setIsFooter0Open(true)}>
              0
            </Button>
            <Button variant="sub2" onClick={() => setIsFooter1Open(true)}>
              1
            </Button>
            <Button variant="sub2" onClick={() => setIsFooter2LeftOpen(true)}>
              2, left
            </Button>
            <Button variant="sub2" onClick={() => setIsFooter2CenterOpen(true)}>
              2, center
            </Button>
            <Button variant="sub2" onClick={() => setIsFooter2RightOpen(true)}>
              2, right
            </Button>
          </section>
        </section>
      </section>
      <FormModal
        title="회원정보 수정"
        description="필수 정보를 입력해 주세요."
        headerType="left"
        open={isHeaderLeftOpen}
        onClose={() => setIsHeaderLeftOpen(false)}
        onPrimary={() => setIsHeaderLeftOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="회원정보 수정"
        description="필수 정보를 입력해 주세요."
        open={isHeaderCenterOpen}
        onClose={() => setIsHeaderCenterOpen(false)}
        onPrimary={() => setIsHeaderCenterOpen(false)}
      >
        <span className="text-sm">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="회원정보 수정"
        description="필수 정보를 입력해 주세요."
        headerType="none"
        open={isHeaderNoneOpen}
        onClose={() => setIsHeaderNoneOpen(false)}
        onPrimary={() => setIsHeaderNoneOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="크기 테스트"
        description="현재 사이즈: sm"
        headerType="left"
        size="sm"
        open={isHeaderSMLeftOpen}
        onClose={() => setIsHeaderSMLeftOpen(false)}
        onPrimary={() => setIsHeaderSMLeftOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="크기 테스트"
        description="현재 사이즈: md"
        headerType="left"
        open={isHeaderMDLeftOpen}
        onClose={() => setIsHeaderMDLeftOpen(false)}
        onPrimary={() => setIsHeaderMDLeftOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="크기 테스트"
        description="현재 사이즈: lg"
        headerType="left"
        size="lg"
        open={isHeaderLGLeftOpen}
        onClose={() => setIsHeaderLGLeftOpen(false)}
        onPrimary={() => setIsHeaderLGLeftOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="FOOTER 설정 예시"
        description="FooterType: 0"
        headerType="left"
        footerType={0}
        open={isFooter0Open}
        onClose={() => setIsFooter0Open(false)}
        onPrimary={() => setIsFooter0Open(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="FOOTER 설정 예시"
        description="FooterType: 1"
        headerType="left"
        footerType={1}
        open={isFooter1Open}
        onClose={() => setIsFooter1Open(false)}
        onPrimary={() => setIsFooter1Open(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="FOOTER 설정 예시"
        description="FooterType: 2, align: left"
        headerType="left"
        footerType={2}
        footerAlign="left"
        open={isFooter2LeftOpen}
        onClose={() => setIsFooter2LeftOpen(false)}
        onPrimary={() => setIsFooter2LeftOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="FOOTER 설정 예시"
        description="FooterType: 2, align: center"
        headerType="left"
        footerType={2}
        footerAlign="center"
        open={isFooter2CenterOpen}
        onClose={() => setIsFooter2CenterOpen(false)}
        onPrimary={() => setIsFooter2CenterOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
      <FormModal
        title="FOOTER 설정 예시"
        description="FooterType: 2, align: right"
        headerType="left"
        footerType={2}
        footerAlign="right"
        open={isFooter2RightOpen}
        onClose={() => setIsFooter2RightOpen(false)}
        onPrimary={() => setIsFooter2RightOpen(false)}
      >
        <span className="text-md">안에 들어가야되는 내용, 형식 등등..</span>
      </FormModal>
    </>
  );
};

export default FormModalArea;
