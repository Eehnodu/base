import TableArea from "./tableArea";
import PaginationArea from "./paginationArea";

const TableComponent = () => {
  return (
    <>
      <title>컴포넌트: 테이블</title>
      <div className="relative w-full flex items-center justify-center">
        <span className="text-xl font-bold">테이블 컴포넌트</span>
      </div>
      <div className="flex flex-row w-full gap-10 justify-center">
        <TableArea />
        <PaginationArea />
      </div>
    </>
  );
};

export default TableComponent;
