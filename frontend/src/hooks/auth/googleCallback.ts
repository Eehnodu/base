import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { usePost } from "../common/useAPI";
import { useAuth } from "@/context/AuthProvider";
import { parseUserInfo } from "../common/getCookie";

interface GoogleProps {
  onSuccess?: (data) => void;
  onError?: (error) => void;
  autoRun?: boolean;
  apiURL: string;
  redirectURL: string;
}

/**
 * Google OAuth2 로그인 콜백 컴포넌트
 *
 * URL 쿼리 파라미터의 `code` 값을 읽어 백엔드 API에 전달하고,
 * 로그인 처리를 수행합니다.
 *
 * @param onSuccess 로그인 성공 시 호출되는 콜백
 * @param onError 로그인 실패 시 호출되는 콜백
 * @param autoRun 자동 실행 여부 (기본값: true)
 * @param apiURL 구글 로그인 처리 API endpoint
 * @param redirectURL 로그인 성공 후 이동할 경로
 *
 * @example
 * <GoogleCallback
 *   apiURL="api/auth/google"
 *   redirectURL="/dashboard"
 *   onSuccess={(data) => console.log("구글 로그인 성공:", data)}
 *   onError={(err) => console.error("구글 로그인 실패:", err)}
 * />
 */
const GoogleCallback = ({
  onSuccess,
  onError,
  autoRun = true,
  apiURL,
  redirectURL,
}: GoogleProps) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const code = new URL(window.location.toString()).searchParams.get("code");
  const device_info = navigator.userAgent;

  const googleLogin = usePost(apiURL);

  const googleLoginAction = async () => {
    if (!code) return;
    try {
      const data = await googleLogin.mutateAsync({
        code,
        device_info,
      });
      const updatedUser = parseUserInfo();
      setUser(updatedUser);
      onSuccess?.(data);
      navigate(redirectURL, { replace: true });
    } catch (err) {
      onError?.(err);
    }
  };

  useEffect(() => {
    if (autoRun) googleLoginAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return null;
};

export default GoogleCallback;
