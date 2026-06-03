
import { LoginFormDTO } from "@/utils/helpers/models/auth/login";
import { getRequest, patchRequest, postRequest } from "../../utils/helpers/common/http-methods";


export const Auth_APIS = {
  login: (body: LoginFormDTO) => postRequest("/api/admin/login", body),
};
