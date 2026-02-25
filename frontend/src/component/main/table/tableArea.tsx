import Table, { Column } from "@/component/common/table/table";

const TableArea = () => {
  const columns: Column[] = [
    { key: "name", header: "이름", align: "center" },
    { key: "age", header: "나이", align: "center" },
    { key: "job", header: "직업", align: "center" },
  ];

  const rows = [
    { name: "홍길동", age: 25, job: "개발자" },
    { name: "김영희", age: 30, job: "디자이너" },
    { name: "박철수", age: 28, job: "PM" },
  ];

  return (
    <>
      <section className="w-full p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">SM</span>
          </div>
          <Table size="sm" columns={columns} data={rows} />
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">MD</span>
          </div>
          <Table columns={columns} data={rows} />
        </section>
        <section className="flex flex-col gap-3">
          <div className="w-full flex items-center flex-row text-lg">
            <span className="font-bold">LG</span>
          </div>
          <Table size="lg" columns={columns} data={rows} />
        </section>
      </section>
    </>
  );
};

export default TableArea;
