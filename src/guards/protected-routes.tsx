import useStore from "@/hooks/useStore";
import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

interface Props {
  children: ReactElement;
}

const ProtectedRoutes: FC<Props> = ({ children }) => {
  const { getToken } = useStore();
  const token = getToken();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to={siteRoutes.login} />;
  }

  // Check if user data exists - if token exists but no user data, redirect to login

  //   const userData = getUser();

  // If token exists but user data is missing or invalid, redirect to login
  //   if (!userData) {
  //     return <Navigate to={siteRoutes.login} />;
  //   }

  return children;
};

export default ProtectedRoutes;
