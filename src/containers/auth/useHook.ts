import { LoginFormDTO } from "@/utils/helpers/models/auth/login";
import { Auth_APIS } from "@/libs/apis/auth.api";
import { useNavigate } from "react-router-dom";
import useStore from "@/hooks/useStore";
import { successToaster, errorToaster } from "@/utils/helpers/common/alert-service";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

const useAuth = () => {
  const navigate = useNavigate();
  const { setToken } = useStore();

  const login = async (body: LoginFormDTO) => {
    const response = await Auth_APIS.login(body);
    const { success = false, message = "" } = response || {};

    if (success) {
      const token = response.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      successToaster(message || "Login successful");
      navigate(siteRoutes.dashboard);
    }
  };

  return {
    login,

  };
};

export default useAuth;
