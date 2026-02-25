import SelectBox from "@/component/common/form/selectBox";

const SelectArea = () => {
  const OPTIONS = [
    { value: "옵션 1", label: "옵션 1" },
    { value: "옵션 2", label: "옵션 2" },
    { value: "옵션 3", label: "옵션 3" },
  ];
  return (
    <>
      <section className="p-5 pr-7 w-full flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row justify-center text-lg">
            <span className="font-bold">SM </span>
          </div>
          <section className="flex flex-col gap-3">
            <SelectBox size="sm" options={OPTIONS} />
          </section>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row justify-center text-lg">
            <span className="font-bold">MD </span>
          </div>
          <section className="flex flex-col gap-3">
            <SelectBox options={OPTIONS} />
          </section>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row justify-center text-lg">
            <span className="font-bold">LG </span>
          </div>
          <section className="flex flex-col gap-3">
            <SelectBox size="lg" options={OPTIONS} />
          </section>
        </section>
      </section>
    </>
  );
};

export default SelectArea;
