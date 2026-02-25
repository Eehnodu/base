// user_info 토큰 타입
export interface UserInfo {
  auth_type: string;
  user_id: number;
  user_name: string;
  created_at: string;
}

// /me 호출 시 넘어오는 데이터 
export interface UserDetail {
  user_name: string;
  user_profile_image: string;
}
