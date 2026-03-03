import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessToken, removeTokens, setAccessToken, getRefreshToken, setRefreshToken, getTokens, setTokens, setUser,getUser } from '../utils/token';
import { useNavigate } from "react-router-dom";
import { loginApi, logoutApi } from '../api/auth.api';
export const useAuth = () => {

  return {
    setAccessToken,
    getAccessToken,
    removeTokens,
    getRefreshToken,
    getTokens,
    setRefreshToken,
    setTokens,
    getUser,
    setUser
  };
};


 

  export const useLogoutMutation = () => {
      const queryClient = useQueryClient();
      const navigate = useNavigate();

      return useMutation({
      mutationFn: logoutApi,
      onSuccess: () => {
        removeTokens();
        queryClient.clear();
        navigate("/login", { replace: true });
      },
      onError: () => {
        removeTokens();
        queryClient.clear();
        navigate("/login", { replace: true });
      },
    });
  };


export const useLoginMutation = () => {
      const navigate = useNavigate();
      return  useMutation({
      mutationFn: loginApi,
      onSuccess: (data) => {
        setTokens(data.data.tokens);
        setUser(data.data.admin);
        navigate("/admin/dashboard", { replace: true });
      },
    });
  };