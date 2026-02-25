import Modal from "@/component/common/feedback/modal";

interface ChatbotDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChatbotDeleteModal = ({
  open,
  onClose,
  onConfirm,
}: ChatbotDeleteModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="챗봇 삭제"
      description="챗봇을 삭제하시겠습니까?"
      buttonCount={2}
      primaryText="삭제"
      secondaryText="취소"
      onPrimary={onConfirm}
      onSecondary={onClose}
    />
  );
};

export default ChatbotDeleteModal;
