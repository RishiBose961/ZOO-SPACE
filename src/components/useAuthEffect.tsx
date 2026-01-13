import { loadUser } from "@/slice/authSlice";
import type { AppDispatch } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

 const useAuthEffect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) => state.auth.isAuthenticated
  );
  
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);
};

export default useAuthEffect;