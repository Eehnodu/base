import CalendarArea from "./calendarArea";

const CalendarComponent = () => {
  return (
    <>
      <title>컴포넌트: 캘린더</title>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">캘린더 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <CalendarArea />
      </div>
    </>
  );
};

export default CalendarComponent;
