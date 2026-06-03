import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./auth-routes";
import DashboardRoutes from "./dashboard-routes";
import { useAppSelector } from "@/store/hooks";
import Loader from "@/components/particles/loader";
import { Fragment } from "react/jsx-runtime";
import ProtectedRoutes from "@/guards/protected-routes";

const AppRoutes = () => {
  const { isLoading, token } = useAppSelector((state) => state.sharedReducer);

  return (
    <Fragment>
      {isLoading && <Loader />}
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route
          path="/*"
          element={<ProtectedRoutes children={<DashboardRoutes />} />}
        />
      </Routes>
    </Fragment>
  );
};

export default AppRoutes;
