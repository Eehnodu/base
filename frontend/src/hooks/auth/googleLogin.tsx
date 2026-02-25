import React, { useEffect, useState } from "react";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { Capacitor } from "@capacitor/core";
import { handleLoggedIn } from "./handleLoggedIn";
import google from "@/assets/client/login/google.svg";
import { useAuth } from "@/context/AuthProvider";

interface GoogleLoginBtnProps {
  client_id?: string;
  redirect_uri?: string;
  scopeParam?: string;
  className?: string;
  children?: React.ReactNode;
}

const client_id_env = import.meta.env.VITE_APP_PUBLIC_GOOGLE_CLIENT_ID;
const ios_client_id_env = import.meta.env.VITE_APP_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const redirect_uri_env = import.meta.env.VITE_APP_PUBLIC_GOOGLE_REDIRECT_URI;

/**
 * Google OAuth2 로그인 버튼 컴포넌트
 *
 * 구글 인증 페이지(`https://accounts.google.com/o/oauth2/v2/auth`)로
 * 리다이렉트 시켜주는 버튼입니다.
 *
 * @param client_id GOOGLE CLIENT ID (Google Cloud Console에서 발급)
 * @param redirect_uri 로그인 후 리다이렉트될 URI (Google OAuth 설정에 등록 필요)
 * @param scopeParam 요청할 권한 스코프 (예: "openid email profile")
 * @param className 버튼에 적용할 CSS 클래스
 * @param children 버튼 안에 표시할 내용 (텍스트/아이콘 등)
 *
 * @example
 * <GoogleLoginBtn
 *   client_id="구글클라이언트ID"
 *   redirect_uri="http://localhost:3000/google"
 *   scopeParam="openid email profile"
 *   className="bg-red-500 text-white px-4 py-2 rounded"
 * >
 *   구글로 로그인
 * </GoogleLoginBtn>
 */
const GoogleLoginBtn = ({
  client_id = client_id_env,
  redirect_uri = redirect_uri_env,
  scopeParam = "openid email profile",
}: GoogleLoginBtnProps) => {
  // GOOGLE SDK init
  const [initialized, setInitialized] = useState(false);
  const { setUser } = useAuth();
  useEffect(() => {
    const initSocialLogin = async () => {
      try {
        await SocialLogin.initialize({
          google: {
            webClientId: client_id,
            iOSClientId: ios_client_id_env,
            iOSServerClientId: client_id,
            mode: "online",
          },
        });
        setInitialized(true);
      } catch (error) {
        console.error("초기화 실패:", error);
      }
    };
    initSocialLogin();
  }, []);

  const handleGoogleLogin = async () => {
    if (!initialized) {
      console.log("초기화 아직 안됨");
      return;
    }
    try {
      const result = await SocialLogin.login({
        provider: "google",
        options: {
          style: "standard",
          filterByAuthorizedAccounts: false,
          // scopes: ["profile", "email"],
          // scopes 사용하면 MainActivity 수정해야 하는데, scopes 없이도 정보 받아옴
        },
      });
      if (result) {
        await handleLoggedIn(result.result, "google", setUser);
      }
    } catch (error) {
      console.log("로그인 실패", error);
    }
  };

  const googleAuth = () => {
    const scopeQuery = scopeParam
      ? `&scope=${encodeURIComponent(scopeParam)}`
      : "";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&response_type=code&access_type=offline${scopeQuery}`;
  };

  return (
    <button
      className="relative bg-white flex flex-row w-[300px] py-3 rounded-lg items-center justify-center text-black font-semibold"
      onClick={Capacitor.isNativePlatform() ? handleGoogleLogin : googleAuth}
    >
      <img src={google} alt="google login" className="absolute left-10" />
      <span>Google로 로그인</span>
    </button>
  );
};

export default GoogleLoginBtn;
