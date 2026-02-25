import { UserInfo } from "@/types/user/user";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)`));
  return match ? match[2].trim() : undefined;
};

export const parseUserInfo = (authType: "user" | "admin" = "user") => {
  const prefix = authType === "admin" ? "admin_" : "user_";
  const cookie = getCookie(`${prefix}user_info`);
  if (!cookie) return null;

  try {
    const binary = atob(cookie.replace(/^"|"$/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("쿠키 파싱 실패:", e);
    return null;
  }
};

const getAuth = async () => {
  const { value } = await Preferences.get({ key: "auth" });
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const decodeUserInfo = async (): Promise<UserInfo | null> => {
  const stored = await getAuth();
  if (!stored) return null;
  try {
    const binary = atob(stored.user_info);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("user_info decode failed", e);
    return null;
  }
};

export const getAuthNativeHeaders = async () => {
  const headers = {};

  if (Capacitor.isNativePlatform()) {
    const auth = await getAuth();

    if (!auth?.user_info) return headers;
    headers["Authorization"] = `Bearer ${auth.user_info}`;
  }
  return headers;
};

export const refreshExp = () => {
  const cookie = getCookie("refresh_exp");
  if (!cookie) return false;
  return true;
};
