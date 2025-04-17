import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  // Add other token fields if needed
}

export const checkAuth = (): boolean => {
  const token = Cookies.get("auth_token");

  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      Cookies.remove("auth_token");
      return false;
    }

    return true;
  } catch (error) {
    Cookies.remove("auth_token");
    return false;
  }
};
