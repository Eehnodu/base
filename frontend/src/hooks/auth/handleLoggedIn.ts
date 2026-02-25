import { Preferences } from "@capacitor/preferences";
import { baseURL } from "../common/useAPI";
import { UserInfo } from "@/types/user/user";
import { decodeUserInfo } from "../common/getCookie";

/**네이티브에서 카카오 및 구글 SDK
 * 사용자 정보 받은 후, 백엔드에 POST
 */
export const handleLoggedIn = async (
  result,
  type: string,
  setUser: (user: UserInfo | null) => void
) => {
  let email: string;
  let nickname: string;
  let profileImg: string;
  let fcmToken: string;

  const { value } = await Preferences.get({ key: "fcmToken" });
  if (value) {
    fcmToken = value;
  }

  if (type == "google") {
    email = result.profile.email;
    nickname = result.profile.name;
    profileImg = result.profile.imageUrl;
  } else if (type == "kakao") {
    email = result.email;
    nickname = result.profile.nickname;
    profileImg = result.profile.profileImageUrl;
  }

  try {
    const response = await fetch(`${baseURL}/api/auth/loggedIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        nickname,
        profileImg,
        fcmToken,
      }),
    });

    if (!response.ok) {
      throw new Error("로그인 요청 실패");
    }

    const data = await response.json();
    await Preferences.set({
      key: "auth",
      value: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user_info: data.user_info,
      }),
    });
    await new Promise((resolve) => setTimeout(resolve, 200));

    const user = await decodeUserInfo();
    setUser(user);
  } catch (error) {
    console.error("로그인 에러:", error);
  }
};
