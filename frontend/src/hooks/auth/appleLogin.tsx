import apple from "@/assets/client/login/apple.svg";
import { useNavigate } from "react-router-dom";

// 얘는 그냥 /login/apple 등으로 url 이동시켜서 container/client/login/apple.tsx만 바라보게 해주면 됨
const AppleLoginBtn = () => {
  const navigate = useNavigate();
  return (
    <button
      className="relative bg-black flex flex-row w-[300px] py-3 rounded-lg items-center justify-center text-white font-semibold"
      onClick={() => navigate("/apple")}
    >
      <img src={apple} alt="google login" className="absolute left-10" />
      <span>Apple로 로그인</span>
    </button>
  );
};

export default AppleLoginBtn;
