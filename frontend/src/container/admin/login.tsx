import Button from "@/component/common/form/button";
import InputBox from "@/component/common/form/inputbox";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/profile.png";
import { usePost, useRefreshToken } from "@/hooks/common/useAPI";
import { useNavigate } from "react-router-dom";
import Modal from "@/component/common/feedback/modal";
import { parseUserInfo, refreshExp } from "@/hooks/common/getCookie";
import { LoginRequest, LoginResponse } from "@/types/admin/login";

const LoginPage = () => {
  const navigate = useNavigate();
  const user = parseUserInfo("admin");
  const isRefresh = refreshExp();
  const refresh = useRefreshToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const loginMutation = usePost<LoginRequest, LoginResponse>("api/auth/login");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password, type: "admin" },
      {
        onSuccess: () => {
          navigate("/admin");
        },
        onError: () => {
          setErrorModal(true);
        },
      }
    );
  };

  useEffect(() => {
    if (user && isRefresh) {
      refresh()
        .then(() => {
          window.location.reload();
        })
        .catch(() => {});
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen bg-sub2 text-main flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 카드 */}
        <div className="rounded-2xl bg-white border border-sub2-active px-8 py-9 shadow-xl">
          {/* 로고 + 제목 */}
          <div className="flex items-center gap-3 mb-6">
            <img src={Logo} alt="Logo" className="w-10 h-10 rounded-md" />
            <div>
              <h1 className="text-xl font-semibold text-main">로그인</h1>
              <p className="text-sm text-main/60">
                관리자 대시보드에 접속하세요.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-5">
            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-main/70 mb-2"
              >
                이메일
              </label>
              <InputBox
                type="email"
                value={email}
                placeholder="이메일을 입력하세요"
                onChange={(val) => setEmail(val)}
                size="md"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-main/70 mb-2"
              >
                비밀번호
              </label>
              <InputBox
                type={showPw ? "text" : "password"}
                value={password}
                placeholder="비밀번호를 입력하세요"
                onChange={(val) => setPassword(val)}
                size="md"
                onRightIconClick={() => setShowPw(!showPw)}
                rightIcon={
                  showPw ? (
                    <Eye className="w-4 h-4 text-main/50" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-main/50" />
                  )
                }
              />
            </div>

            {/* 버튼 */}
            <div className="flex w-full">
              <Button
                variant="main"
                size="md"
                full
                onClick={onSubmit}
                disabled={!email || !password}
              >
                로그인
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-[10px] text-main/40 text-center">
          © {new Date().getFullYear()} Component • All rights reserved.
        </p>
      </div>
      {errorModal && (
        <Modal
          buttonCount={1}
          open={errorModal}
          title="로그인 실패"
          description="이메일 또는 비밀번호가 일치하지 않습니다."
          onClose={() => setErrorModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;
