import Pagination from "@/component/common/pagination";
import { useState } from "react";

const PaginationArea = () => {
  const [page, setPage] = useState<number>(1);
  return (
    <>
      <Pagination
        className="absolute bottom-5"
        page={page}
        total={123}
        pageSize={10}
        onChange={(v) => setPage(v)}
      />
    </>
  );
};

export default PaginationArea;
