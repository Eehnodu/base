interface LoadingProps {
  message?: string;
  full?: boolean;
}

const Loading = ({ message = "로딩중...", full = false }: LoadingProps) => {
  return (
    <div
      className={
        full
          ? "fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
          : "absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm"
      }
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-14 w-14 rounded-full border-[5px] border-gray-200 border-t-gray-500 animate-spin" />

        {/* Message */}
        {message && (
          <div className="text-base font-medium text-gray-700">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Loading;
