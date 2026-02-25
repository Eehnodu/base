// chatbot
export interface PendingSelectAction {
  type: "select";
  chatbot: Chatbot;
}

export interface PendingCreateAction {
  type: "create";
}

// chatbotlist
export interface Chatbot {
  id: number;
  name: string;
}

export interface ChatbotListProps {
  list: Chatbot[];
  selectedId: number | null;
  onSelect: (chatbot: Chatbot) => void;
  onCreate: () => void;
  onDelete?: (id: number) => void;
}

// chatbotdetail
export interface ChatbotDetail {
  id: number;
  name: string;
  description: string;
  greeting_message: string;
  response_model: string;
  data_type: "text" | "file";
  text_data: string | null;
  vector_store_id: string | null;
  vector_file_ids: string[] | null;
  vector_file_names: string[] | null;
  fallback_type: boolean;
  fallback_text: string;
}

export interface ChatbotDetailProps {
  chatbot: ChatbotDetail;
  onDirtyChange: (dirty: boolean) => void;
  onSave: (
    form: ChatbotDetail,
    files: File[],
    removedRemoteIds: string[]
  ) => void;
}

export interface FileSlot {
  key: string;
  remoteId?: string;
  remoteName?: string;
  file: File | null;
  added: boolean;
}
