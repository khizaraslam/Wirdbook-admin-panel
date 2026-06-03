import AppRoutes from "./routes";
import { Fragment } from "react/jsx-runtime";
import useStore from "./hooks/useStore";
import { useEffect } from "react";
import useHttp from "./hooks/useHttp";

function App() {
  const { configureHeaders, configureInterceptors } = useHttp();
  const { setLoading } = useStore();

  // Configure interceptors once on mount
  useEffect(() => {
    configureHeaders();
    configureInterceptors();
    setLoading(false);
  }, []);

  return (
    <Fragment>
      <AppRoutes />
    </Fragment>
  );
}

export default App;
