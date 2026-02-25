import SelectBox from "@/component/common/form/selectBox";
import InputBox from "@/component/common/form/inputbox";
import Pagination from "@/component/common/pagination";
import Button from "@/component/common/form/button";
import FormModal from "@/component/common/feedback/formModal";
import Calendar, { RangeValue } from "@/component/common/form/calendar";
import Loading from "@/component/common/loading";
import Table, { Column } from "@/component/common/table/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGet } from "@/hooks/common/useAPI";
import { formatDate, formatClock } from "@/utils/format/date";

type Role = "user" | "ai";

interface Message {
  role: Role;
  message: string;
  created_at: string;
}

interface LogRow {
  id: number;
  created_at: string;
  ended_at: string | null;
  user_name: string | null;
  messages: Message[];
  total_tokens: number;
}

interface LogListsData {
  total: number;
  data: LogRow[];
  current_page: number;
}

const categories = [
  { label: "유저명", value: "user_name" },
  { label: "내용", value: "message" },
];

const pageSize = 10;

const AdminLogs = () => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<RangeValue>({
    start: null,
    end: null,
  });

  const [messageModal, setMessageModal] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);

  const columns: Column[] = [
    { key: "id", header: "No", width: "1.5rem", align: "center" },
    { key: "user_name", header: "유저명", width: "10rem", align: "center" },
    { key: "created_at", header: "생성일", width: "10rem", align: "center" },
    { key: "ended_at", header: "종료일", width: "10rem", align: "center" },
    { key: "total_tokens", header: "토큰", width: "10rem", align: "center" },
    {
      key: "messages",
      header: "대화 내역",
      width: "10rem",
      align: "center",
      render: (row: LogRow) => (
        <Button
          size="sm"
          variant="sub2"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMessages(row.messages ?? []);
            setMessageModal(true);
          }}
        >
          보기
        </Button>
      ),
    },
  ];

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", String(pageSize));
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (dateRange.start) params.set("start_date", formatDate(dateRange.start));
  if (dateRange.end) params.set("end_date", formatDate(dateRange.end));

  const { data: logListsData } = useGet<LogListsData>(
    `api/admin/logs/lists?${params.toString()}`,
    ["LogListsData", params.toString()]
  );

  if (!logListsData) {
    return <Loading message="데이터를 불러오는 중입니다..." />;
  }

  const rows = logListsData?.data ?? [];
  const total = logListsData?.total ?? 0;

  return (
    <div className="relative flex w-full h-full flex-col gap-6 overflow-hidden">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex flex-col gap-2 justify-end items-end">
          <Calendar
            position="left"
            value={dateRange}
            onChange={(next) => {
              setDateRange(next);
              setPage(1);
            }}
          />

          <div className="flex items-center gap-2">
            <SelectBox
              className="min-w-[140px]"
              options={categories}
              value={category}
              onChange={(value) => {
                setCategory(value as string);
                setPage(1);
              }}
            />

            <InputBox
              placeholder="검색"
              leftIcon={<Search className="w-4 h-4 text-main/50" />}
              className="min-w-[260px]"
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <Table columns={columns} data={rows} rowCount={total} />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <Pagination
            page={page}
            size="md"
            total={total}
            pageSize={pageSize}
            onChange={(nextPage) => setPage(nextPage)}
          />
        </div>
      </div>

      <FormModal
        open={messageModal}
        size="lg"
        onClose={() => {
          setMessageModal(false);
          setSelectedMessages([]);
        }}
        title="대화 내역"
        footerType={0}
      >
        <div className="flex max-h-[65vh] flex-col gap-2 overflow-y-auto pr-1">
          {selectedMessages.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              대화 내역이 없습니다.
            </div>
          ) : (
            selectedMessages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={`${m.created_at}-${idx}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-end ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    } gap-1 max-w-[80%]`}
                  >
                    <div className="rounded-2xl bg-main/10 px-4 py-2 text-sm leading-relaxed text-gray-900">
                      <div className="whitespace-pre-wrap break-words">
                        {m.message}
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500 whitespace-nowrap">
                      {formatClock(m.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </FormModal>
    </div>
  );
};

export default AdminLogs;
