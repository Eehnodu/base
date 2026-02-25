import { useNavigate } from "react-router-dom";
import { usePost } from "../common/useAPI";
import { decodeUserInfo } from "../common/getCookie";
import { Preferences } from "@capacitor/preferences";

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutMutation = usePost("api/auth/logout");

  // 로그아웃 했을 때 FCM deactive
  const nativeLogoutMutation = usePost("api/auth/native_logout");
  const handleLogout = async () => {
    // 애플 SDK 자체는 쿠키에 넣어서 여기서는 분기처리 안하고 둘 다 진행
    const sdk = await decodeUserInfo();
    if (sdk) {
      await nativeLogoutMutation.mutateAsync();
      await Preferences.clear();
    } else {
      logoutMutation.mutate();
    }
    navigate("/");
    window.location.reload();
  };

  return handleLogout;
};
