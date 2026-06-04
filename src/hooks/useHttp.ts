import axios from "../utils/helpers/common/axios.config";
import useStore from "./useStore";
import { errorToaster } from "../utils/helpers/common/alert-service";
import { errorMessages } from "../utils/helpers/enums/messages.enum";

let pendingRequests = 0;
let requestInterceptorId: number | null = null;
let responseInterceptorId: number | null = null;

/** Reset stuck global loader after navigation or failed request chains */
export const resetHttpLoading = () => {
  pendingRequests = 0;
};

const useHttp = () => {
  const { logout, setLoading } = useStore();

  const syncLoadingState = () => {
    setLoading(pendingRequests > 0);
  };

  const stopLoaderForConfig = (config: { _shouldShowLoader?: boolean } | undefined) => {
    if (config?._shouldShowLoader) {
      pendingRequests = Math.max(0, pendingRequests - 1);
      syncLoadingState();
    }
  };

  const isPreventLoaderAPI = (apiUrl: string): boolean => {
    if (!apiUrl) return false;

    let path = apiUrl.split("?")[0];

    if (path.startsWith("http://") || path.startsWith("https://")) {
      try {
        const urlObj = new URL(path);
        path = urlObj.pathname;
      } catch {
        const match = path.match(/https?:\/\/[^/]+(\/.*)/);
        if (match) path = match[1];
      }
    }

    const baseUrl = import.meta.env.VITE_BASE_URL_PREFIX || "";
    if (baseUrl && path.includes(baseUrl)) {
      path = path.substring(path.indexOf(baseUrl) + baseUrl.length);
    }

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const stopLoaderAPIs = [
      /^\/event\/\d+\/messages$/,
      /^\/api\/admin\/qa(\/|$)/,
    ];
    return stopLoaderAPIs.some((regex) => regex.test(path));
  };

  function configureHeaders() {
    if (requestInterceptorId !== null) {
      axios.interceptors.request.eject(requestInterceptorId);
    }

    requestInterceptorId = axios.interceptors.request.use(
      (config: any) => {
        const shouldPreventLoader = isPreventLoaderAPI(config.url || "");

        if (!shouldPreventLoader) {
          pendingRequests += 1;
          syncLoadingState();
          config._shouldShowLoader = true;
        } else {
          config._shouldShowLoader = false;
        }
        return config;
      },
      (error) => {
        stopLoaderForConfig(error?.config);
        return Promise.reject(error);
      },
    );
  }

  const configureInterceptors = () => {
    if (responseInterceptorId !== null) {
      axios.interceptors.response.eject(responseInterceptorId);
    }

    responseInterceptorId = axios.interceptors.response.use(
      (response: any) => {
        stopLoaderForConfig(response?.config);
        if (response?.data?.success === false || response?.data?.success == 0)
          displayApiErrors(response);
        return response;
      },
      async (error) => {
        stopLoaderForConfig(error?.config);
        if (error?.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      },
    );
  };

  const displayApiErrors = (response: any) => {
    errorToaster(
      response?.data?.errors?.length &&
        typeof response?.data?.errors === "object"
        ? response?.data?.errors[0]
        : response?.data?.message?.length
          ? response?.data?.message
          : response?.data?.error?.length
            ? response?.data?.error
            : errorMessages.somethingWentWrong,
    );
  };

  return {
    configureHeaders,
    configureInterceptors,
  };
};

export default useHttp;
