import AreaComponent from "./area/areaComponent";
import BoxComponent from "./box/boxComponent";
import ButtonComponent from "./button/buttonComponent";
import CalendarComponent from "./calendar/calendarComponent";
import ModalComponents from "./modal/modalComponents";
import TableComponent from "./table/tableComponent";
import ToggleComponent from "./toggle/toggleComponent";

const MainComponent = ({ component }) => {
  return (
    <>
      <div className="p-10 pt-20 flex flex-row w-full gap-10 justify-center">
        <div className="flex flex-col gap-5 w-full">
          {component == "button" && <ButtonComponent />}
          {component == "toggle" && <ToggleComponent />}
          {component == "box" && <BoxComponent />}
          {component == "area" && <AreaComponent />}
          {component == "table" && <TableComponent />}
          {component == "modal" && <ModalComponents />}
          {component == "calendar" && <CalendarComponent />}
        </div>
      </div>
    </>
  );
};

export default MainComponent;
