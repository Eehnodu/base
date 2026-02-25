import Modal from "@/component/common/feedback/modal";

interface ChatbotEditModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChatbotEditModal = ({
  open,
  onClose,
  onConfirm,
}: ChatbotEditModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="챗봇 수정"
      description={"챗봇을 수정하시겠습니까?\n작성하던 내용은 모두 사라집니다."}
      buttonCount={2}
      primaryText="수정"
      secondaryText="취소"
      onPrimary={onConfirm}
      onSecondary={onClose}
    />
  );
};

export default ChatbotEditModal;
