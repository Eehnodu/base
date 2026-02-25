import RadioButton from "@/component/common/form/radioButton";
import { useState } from "react";

const RadioArea = () => {
  const [smSelected, setSMSelected] = useState<string>("smOptionA");
  const [mdSelected, setMDSelected] = useState<string>("mdOptionA");
  const [lgSelected, setLGSelected] = useState<string>("lgOptionA");
  const [dbSelected, setDBSelected] = useState<string>("dbOptionA");
  return (
    <>
      <section className="w-full p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">SM</span>
          </div>
          <div className="flex flex-row gap-6">
            <RadioButton
              checked={smSelected == "smOptionA"}
              size="sm"
              name="sm"
              value="smOptionA"
              onChange={(value) => setSMSelected(value)}
              label="option A"
            />
            <RadioButton
              checked={smSelected == "smOptionB"}
              size="sm"
              name="sm"
              value="smOptionB"
              onChange={(value) => setSMSelected(value)}
              label="option B"
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">MD</span>
          </div>
          <div className="flex flex-row gap-6">
            <RadioButton
              checked={mdSelected == "mdOptionA"}
              name="md"
              value="mdOptionA"
              onChange={(value) => setMDSelected(value)}
              label="option A"
            />
            <RadioButton
              checked={mdSelected == "mdOptionB"}
              name="md"
              value="mdOptionB"
              onChange={(value) => setMDSelected(value)}
              label="option B"
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">LG</span>
          </div>
          <div className="flex flex-row gap-6">
            <RadioButton
              checked={lgSelected == "lgOptionA"}
              size="lg"
              name="lg"
              value="lgOptionA"
              onChange={(value) => setLGSelected(value)}
              label="option A"
            />
            <RadioButton
              checked={lgSelected == "lgOptionB"}
              size="lg"
              name="lg"
              value="lgOptionB"
              onChange={(value) => setLGSelected(value)}
              label="option B"
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">Disabled</span>
          </div>
          <div className="flex flex-row gap-6">
            <RadioButton
              checked={dbSelected == "dbOptionA"}
              name="db"
              value="dbOptionA"
              disabled={true}
              onChange={(value) => setDBSelected(value)}
              label="option A"
            />
            <RadioButton
              checked={dbSelected == "dbOptionB"}
              name="db"
              value="dbOptionB"
              disabled={true}
              onChange={(value) => setDBSelected(value)}
              label="option B"
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default RadioArea;
