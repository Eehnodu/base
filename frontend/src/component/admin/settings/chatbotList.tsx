import Button from "@/component/common/form/button";
import { ChatbotListProps } from "@/types/admin/chatbot";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

const ChatbotList = ({
  list,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}: ChatbotListProps) => {
  const hasItems = list.length > 0;

  return (
    <div className="h-full flex flex-col gap-4 border border-gray-400 rounded-md px-4 py-4 overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-bold text-gray-900">챗봇 리스트</span>
        <Button
          size="sm"
          variant="main"
          leftIcon={<PlusIcon className="w-4 h-4" />}
          onClick={onCreate}
        >
          추가
        </Button>
      </div>

      {!hasItems ? (
        <div className="text-sm text-gray-400 text-center py-6">
          등록된 챗봇이 없습니다
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map((chatbot, idx) => {
            const isSelected = chatbot.id === selectedId;

            return (
              <div
                key={chatbot.id}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-md border",
                  isSelected ? "border-gray-500 bg-gray-50" : "border-gray-400",
                ].join(" ")}
              >
                <span className="shrink-0 text-sm text-gray-700 w-14">
                  No.{idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <span className="block text-sm text-gray-900 truncate">
                    {chatbot.name || "-"}
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="sub2"
                    leftIcon={<PencilIcon className="w-4 h-4" />}
                    onClick={() => onSelect(chatbot)}
                  >
                    수정
                  </Button>

                  {onDelete ? (
                    <Button
                      size="sm"
                      variant="sub2"
                      leftIcon={<TrashIcon className="w-4 h-4 text-red-500" />}
                      className="text-red-500"
                      onClick={() => onDelete(chatbot.id)}
                    >
                      삭제
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatbotList;
