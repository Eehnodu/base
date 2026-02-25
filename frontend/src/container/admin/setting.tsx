import { useState } from "react";
import { useGet, usePost } from "@/hooks/common/useAPI";
import ChatbotList from "@/component/admin/settings/chatbotList";
import ChatbotDetailView from "@/component/admin/settings/chatbotDetail";
import Loading from "@/component/common/loading";
import { useQueryClient } from "@tanstack/react-query";
import {
  Chatbot,
  ChatbotDetail,
  PendingSelectAction,
  PendingCreateAction,
} from "@/types/admin/chatbot";
import ChatbotDeleteModal from "@/component/admin/modal/chatbotDelete";
import ChatbotEditModal from "@/component/admin/modal/chatbotEdit";

const createTempChatbot = (): Chatbot => ({
  id: -Date.now(),
  name: "",
});

const makeEmptyDetail = (): ChatbotDetail => ({
  id: null,
  name: "",
  description: "",
  greeting_message: "",
  response_model: "gpt-4o-mini",
  data_type: "text",
  text_data: "",
  vector_store_id: null,
  vector_file_ids: null,
  vector_file_names: null,
  fallback_type: true,
  fallback_text: "",
});

type PendingAction = PendingSelectAction | PendingCreateAction | null;

const AdminSetting = () => {
  const queryClient = useQueryClient();
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);

  const [dirty, setDirty] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [createDetail, setCreateDetail] = useState<ChatbotDetail | null>(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const isCreateMode = (selectedChatbot?.id ?? 0) < 0;

  const { data: chatbotListData } = useGet<Chatbot[]>(
    "api/admin/chatbot/list",
    ["ChatbotListData"]
  );

  const detailUrl =
    selectedChatbot && !isCreateMode
      ? `api/admin/chatbot/detail?chatbot_id=${selectedChatbot.id}`
      : "";

  const { data: chatbotDetailData } = useGet<ChatbotDetail>(
    detailUrl,
    ["ChatbotDetailData", selectedChatbot?.id],
    !!detailUrl
  );

  const detail = isCreateMode
    ? (createDetail ?? makeEmptyDetail())
    : (chatbotDetailData ?? null);

  const saveMutation = usePost<FormData, void>("api/admin/chatbot/save");
  const deleteMutation = usePost<{ id: number }, void>(
    "api/admin/chatbot/delete"
  );

  const selectedId =
    !selectedChatbot || isCreateMode ? null : selectedChatbot.id;

  const runAction = (action: PendingAction) => {
    if (!action) return;

    if (action.type === "select") {
      setSelectedChatbot(action.chatbot);
      setCreateDetail(null);
      return;
    }

    setSelectedChatbot(createTempChatbot());
    setCreateDetail(makeEmptyDetail());
  };

  const guardAction = (action: PendingAction) => {
    if (!dirty) {
      runAction(action);
      return;
    }

    setPendingAction(action);
    setEditModal(true);
  };

  if (!chatbotListData) {
    return <Loading message="데이터를 불러오는 중입니다..." />;
  }

  return (
    <div className="flex w-full h-full gap-6 relative">
      <div className="w-1/3 h-full">
        <ChatbotList
          list={chatbotListData}
          selectedId={selectedId}
          onSelect={(cb) => guardAction({ type: "select", chatbot: cb })}
          onCreate={() => guardAction({ type: "create" })}
          onDelete={(id) => {
            setDeleteModal(true);
            setPendingDeleteId(id);
          }}
        />
      </div>

      <div className="w-2/3 h-full border border-gray-400 rounded-md px-4 py-2 relative">
        {saveMutation.isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60">
            <Loading message="저장 중입니다..." />
          </div>
        )}

        {detail ? (
          <ChatbotDetailView
            chatbot={detail}
            onDirtyChange={(v) => setDirty(v)}
            onSave={(form, files, removedRemoteIds) => {
              const fd = new FormData();
              fd.append("payload", JSON.stringify(form));
              fd.append("removed_remote_ids", JSON.stringify(removedRemoteIds));
              files.forEach((f) => fd.append("files", f));

              saveMutation.mutate(fd, {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["ChatbotListData"],
                  });
                  setDirty(false);
                  setCreateDetail(null);
                },
              });
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            챗봇을 선택해주세요
          </div>
        )}
      </div>

      {editModal && (
        <ChatbotEditModal
          open={editModal}
          onClose={() => {
            setEditModal(false);
            setPendingAction(null);
          }}
          onConfirm={() => {
            setDirty(false);
            runAction(pendingAction);
            setPendingAction(null);
            setEditModal(false);
          }}
        />
      )}

      {deleteModal && (
        <ChatbotDeleteModal
          open={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setPendingDeleteId(null);
          }}
          onConfirm={() => {
            if (pendingDeleteId == null) return;

            deleteMutation.mutate(
              { id: pendingDeleteId },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["ChatbotListData"],
                  });

                  if (selectedChatbot?.id === pendingDeleteId) {
                    setSelectedChatbot(null);
                    setCreateDetail(null);
                  }
                },
                onSettled: () => {
                  setDeleteModal(false);
                  setPendingDeleteId(null);
                },
              }
            );
          }}
        />
      )}
    </div>
  );
};

export default AdminSetting;
