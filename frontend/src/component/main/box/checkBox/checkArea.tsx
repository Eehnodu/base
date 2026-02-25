import Checkbox from "@/component/common/form/checkbox";
import { useState } from "react";

const CheckArea = () => {
  const [smCheck1, setSMCheck1] = useState<boolean>(true);
  const [smCheck2, setSMCheck2] = useState<boolean>(false);
  const [mdCheck1, setMDCheck1] = useState<boolean>(true);
  const [mdCheck2, setMDCheck2] = useState<boolean>(false);
  const [lgCheck1, setLGCheck1] = useState<boolean>(true);
  const [lgCheck2, setLGCheck2] = useState<boolean>(false);
  const [dbCheck1, setDBCheck1] = useState<boolean>(true);
  const [dbCheck2, setDBCheck2] = useState<boolean>(false);
  return (
    <>
      <section className="w-full p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">SM</span>
          </div>
          <div className="flex flex-row gap-6">
            <Checkbox
              size="sm"
              checked={smCheck1}
              onChange={() => setSMCheck1((prev) => !prev)}
              label="Small Checkbox"
            />
            <Checkbox
              size="sm"
              checked={smCheck2}
              onChange={() => setSMCheck2((prev) => !prev)}
              label="Small Checkbox"
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">MD</span>
          </div>
          <div className="flex flex-row gap-6">
            <Checkbox
              checked={mdCheck1}
              onChange={() => setMDCheck1((prev) => !prev)}
              label="Medium Checkbox"
            />
            <Checkbox
              checked={mdCheck2}
              onChange={() => setMDCheck2((prev) => !prev)}
              label="Medium Checkbox"
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">LG</span>
          </div>
          <div className="flex flex-row gap-6">
            <Checkbox
              checked={lgCheck1}
              onChange={() => setLGCheck1((prev) => !prev)}
              label="Large Checkbox"
            />
            <Checkbox
              checked={lgCheck2}
              onChange={() => setLGCheck2((prev) => !prev)}
              label="Large Checkbox"
            />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">Disabled</span>
          </div>
          <div className="flex flex-row gap-6 ">
            <Checkbox
              checked={dbCheck1}
              disabled={true}
              onChange={() => setDBCheck1((prev) => !prev)}
              label="Disabled (On)"
            />
            <Checkbox
              checked={dbCheck2}
              disabled={true}
              onChange={() => setDBCheck2((prev) => !prev)}
              label="Disabled (Off)"
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default CheckArea;
