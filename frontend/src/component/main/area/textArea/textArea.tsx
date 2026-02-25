import TextareaBox from "@/component/common/form/textareaBox";
import { useState } from "react";

const TextArea = () => {
  const [smText, setSMText] = useState<string>("");
  const [mdText, setMDText] = useState<string>("");
  const [lgText, setLGText] = useState<string>("");
  return (
    <>
      <section className="w-full p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">SM Input Area</span>
          </div>
          <section className="flex flex-col gap-3">
            <TextareaBox
              size="sm"
              value={smText}
              onChange={(value) => setSMText(value)}
            />
          </section>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">MD Input Area</span>
          </div>
          <section className="flex flex-col gap-3">
            <TextareaBox
              value={mdText}
              onChange={(value) => setMDText(value)}
            />
          </section>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">LG Input Area</span>
          </div>
          <section className="flex flex-col gap-3">
            <TextareaBox
              size="lg"
              value={lgText}
              onChange={(value) => setLGText(value)}
            />
          </section>
        </section>
      </section>
    </>
  );
};

export default TextArea;
