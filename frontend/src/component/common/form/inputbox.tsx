import { useState } from "react";

/**
 * InputBox 사이즈 타입
 */
type Size = "sm" | "md" | "lg";

/**
 * InputBox Input 타입
 */
type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search";

/**
 * InputBox 컴포넌트 Props
 *
 * @property value             입력된 텍스트 값
 * @property onChange          값 변경 이벤트
 * @property placeholder       placeholder 텍스트
 * @property type              input type
 * @property className         래퍼 커스텀 클래스
 * @property size              입력창 크기
 * @property disabled          비활성화 여부
 * @property success           성공 상태
 * @property error             에러 상태
 * @property leftIcon          왼쪽 아이콘
 * @property rightIcon         오른쪽 아이콘
 * @property onLeftIconClick   왼쪽 아이콘 클릭 핸들러
 * @property onRightIconClick  오른쪽 아이콘 클릭 핸들러
 */
interface InputBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: InputType;
  className?: string;
  size?: Size;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

/**
 * 재사용 InputBox
 */
const InputBox = ({
  value = "",
  onChange,
  placeholder = "입력하세요",
  type = "text",
  className = "",
  size = "md",
  disabled = false,
  success = false,
  error = false,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
}: InputBoxProps) => {
  const [focused, setFocused] = useState(false);

  const sizeStyles = {
    sm: {
      wrapper: "h-8 text-xs px-2 gap-1",
      input: "text-xs",
      icon: "w-3 h-3",
    },
    md: {
      wrapper: "h-10 text-sm px-3 gap-2",
      input: "text-sm",
      icon: "w-4 h-4",
    },
    lg: {
      wrapper: "h-12 text-base px-3 gap-3",
      input: "text-base",
      icon: "w-5 h-5",
    },
  }[size];

  const borderColor = (() => {
    if (error) return "border-red-500";
    if (success) return "border-green-500";
    if (focused) return "border-main";
    return "border-gray-300 hover:border-main";
  })();

  return (
    <div
      className={`
        flex items-center rounded-md border bg-white w-full
        transition-colors
        ${sizeStyles.wrapper}
        ${borderColor}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-text"}
        ${className}
      `}
      onClick={() => !disabled && setFocused(true)}
    >
      {/* 왼쪽 아이콘 */}
      {leftIcon && (
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onLeftIconClick?.();
          }}
          className={`
            flex items-center justify-center
            ${sizeStyles.icon}
            ${disabled ? "pointer-events-none" : "cursor-pointer"}
          `}
        >
          {leftIcon}
        </button>
      )}

      {/* 입력창 */}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          flex-1 outline-none bg-transparent
          ${sizeStyles.input}
        `}
      />

      {/* 오른쪽 아이콘 */}
      {rightIcon && (
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onRightIconClick?.();
          }}
          className={`
            flex items-center justify-center
            ${sizeStyles.icon}
            ${disabled ? "pointer-events-none" : "cursor-pointer"}
          `}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

export default InputBox;
