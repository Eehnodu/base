import profile from "@/assets/profile.png";
import { useState } from "react";
import MainComponent from "@/component/main/component";
import MainNav from "@/component/main/nav";

const ClientMain = () => {
  const [component, setComponent] = useState<
    "button" | "toggle" | "box" | "area" | "modal" | "table" | "calendar"
  >("button");
  return (
    <>
      <div className="flex flex-row h-screen w-screen">
        <aside className="flex flex-col gap-3 h-full w-[220px] border-r border-r-gray-300">
          <div className="flex flex-row p-3 border-b border-b-gray-300 items-center gap-3 w-full justify-center">
            <img src={profile} alt="프로필" className="w-8 h-8 rounded-full" />
            <span className="text-lg font-bold">UI 컴포넌트</span>
          </div>
          <MainNav component={component} setComponent={setComponent} />
        </aside>
        <MainComponent component={component} />
      </div>
    </>
  );
};

export default ClientMain;
