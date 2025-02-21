
import { useLogin } from "./useLogin";
import { useSignup } from "./useSignup";
import { usePasswordReset } from "./usePasswordReset";

export const useAuthentication = () => {
  const login = useLogin();
  const signup = useSignup();
  const passwordReset = usePasswordReset();

  return {
    ...login,
    ...signup,
    ...passwordReset,
  };
};
