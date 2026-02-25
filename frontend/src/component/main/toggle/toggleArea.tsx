import Toggle from "@/component/common/form/toggle";

const ToggleArea = () => {
  return (
    <>
      <title>컴포넌트: 토글</title>{" "}
      <section className="p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <div className="w-full flex items-center flex-row justify-center text-lg">
          <span className="font-bold">SM 토글</span>
        </div>
        <section className="flex flex-col gap-3">
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>기본 (Off)</span>
              <Toggle size="sm"></Toggle>
            </div>
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>기본 (On)</span>
              <Toggle size="sm" defaultChecked></Toggle>
            </div>
          </div>
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>Disabled</span>
              <Toggle size="sm" disabled={true}></Toggle>
            </div>
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>Disabled</span>
              <Toggle size="sm" defaultChecked disabled={true}></Toggle>
            </div>
          </div>
        </section>
      </section>
      <section className="p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <div className="w-full flex items-center flex-row justify-center text-lg">
          <span className="font-bold">MD 토글</span>
        </div>
        <section className="flex flex-col gap-3">
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>기본 (Off)</span>
              <Toggle></Toggle>
            </div>
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>기본 (On)</span>
              <Toggle defaultChecked></Toggle>
            </div>
          </div>
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>Disabled</span>
              <Toggle disabled={true}></Toggle>
            </div>
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>Disabled</span>
              <Toggle defaultChecked disabled={true}></Toggle>
            </div>
          </div>
        </section>
      </section>
      <section className="p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <div className="w-full flex items-center flex-row justify-center text-lg">
          <span className="font-bold">LG 토글</span>
        </div>
        <section className="flex flex-col gap-3">
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>기본 (Off)</span>
              <Toggle size="lg"></Toggle>
            </div>
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>기본 (On)</span>
              <Toggle size="lg" defaultChecked></Toggle>
            </div>
          </div>
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>Disabled</span>
              <Toggle size="lg" disabled={true}></Toggle>
            </div>
            <div className="flex flex-row items-center justify-between w-[130px]">
              <span>Disabled</span>
              <Toggle size="lg" defaultChecked disabled={true}></Toggle>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default ToggleArea;
