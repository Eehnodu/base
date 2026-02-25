import Calendar, { RangeValue } from "@/component/common/form/calendar";
import { useState } from "react";

const CalendarArea = () => {
  const [rangeSM, setRangeSM] = useState<RangeValue>({
    start: null,
    end: null,
  });
  const [rangeMD, setRangeMD] = useState<RangeValue>({
    start: null,
    end: null,
  });
  const [rangeLG, setRangeLG] = useState<RangeValue>({
    start: null,
    end: null,
  });

  return (
    <>
      <section className="w-fit p-5 pr-7 flex flex-row border border-[#D3D3D3] rounded-md gap-5 h-fit justify-around">
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">SM</span>
          </div>
          <Calendar size="sm" value={rangeSM} onChange={(v) => setRangeSM(v)} />
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">MD</span>
          </div>
          <Calendar value={rangeMD} onChange={(v) => setRangeMD(v)} />
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">LG</span>
          </div>
          <Calendar size="lg" value={rangeLG} onChange={(v) => setRangeLG(v)} />
        </section>
      </section>
    </>
  );
};

export default CalendarArea;
