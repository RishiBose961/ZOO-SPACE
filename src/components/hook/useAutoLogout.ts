/* eslint-disable react-hooks/exhaustive-deps */
import { logoutUserAction } from "@/slice/authSlice";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

type JwtPayload = { exp: number };

export const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const { isAuthenticated, user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        isLoading: boolean;
        user: {token: string  };
      };
    }) => state.auth
  );

  useEffect(() => {
    if (!user?.token) return;

    try {
      const { exp } = jwtDecode<JwtPayload>(user?.token);
      const timeLeft = exp * 1000 - Date.now();

      if (timeLeft <= 0) {
        dispatch(logoutUserAction());
        navigate("/auth", { replace: true });
        return;
      }

      const timeout = setTimeout(() => {
        dispatch(logoutUserAction());
        navigate("/auth", { replace: true });
      }, timeLeft);

      return () => clearTimeout(timeout);
    } catch {
      dispatch(logoutUserAction());
      navigate("/auth", { replace: true });
    }
  }, [user?.token, isAuthenticated]);
};
