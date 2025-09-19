import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000; // exp in seconds → ms
  } catch {
    return true; // agar decode fail ho
  }
};
