import axios from "./axios.config";
import { errorToaster } from "./alert-service";
import { errorMessages, warningMessages } from "../enums/messages.enum";

import { store } from "@/store";

const getHeaders = () => {
    const token = localStorage.getItem("token");
  // const role = localStorage.getItem('role');
  // const state = store.getState();
  // const token = state.sharedReducer.token;
  const headers: any = {
    Authorization: `Bearer ${token}`,
    accept: "*/*",
  };
  return headers;
};

export const postRequest = async (url: string, data: any, params: any = {}) => {
  try {
    const headers = getHeaders();
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const response: any = await axios.post(url, data, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const getRequest = async (url: string, params: any = {}) => {
  try {
    const headers = getHeaders();
    const response: any = await axios.get(url, { params, headers });
    console.log(response.data)
    if(response.data?.data?.pendrequstsCount){
      localStorage.setItem('pendrequstsCount', response?.data?.data?.pendrequstsCount)
    }
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const putRequest = async (url: string, data: any, params: any = {}) => {
  try {
    const headers = getHeaders();
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const response: any = await axios.put(url, data, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const patchRequest = async (
  url: string,
  data: any,
  params: any = {}
) => {
  try {
    const headers = getHeaders();
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const response: any = await axios.patch(url, data, { params, headers });
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteRequest: any = async (url: string, params: any = {}) => {
  try {
    const headers = getHeaders();
    const response = await axios.delete(url, { params, headers });
    return response?.data;
  } catch (error) {
    console.log(url, "url");
    return errorHandler(error);
  }
};

const errorHandler = (error: any) => {
  let message = "";

  if (error.response) {
    const { status, data } = error.response;

    // ✅ 401 - Unauthorized
    if (status === 401) {

      // If NOT login request → session expired
      if (!error.config?.url?.includes("/login")) {
        errorToaster(warningMessages.sessionExpired);
        localStorage.clear();
      } else {
        // Login error
        errorToaster(data?.message || "Invalid credentials");
      }

    }

    // ✅ 400 - Validation Error
    else if (status === 400) {
      if (Array.isArray(data?.error)) {
        data.error.forEach((err: string) => {
          errorToaster(err);
        });
      } else {
        errorToaster(data?.message || "Bad Request");
      }
    }

    // ✅ Other errors
    else {
      errorToaster(data?.message || errorMessages.somethingWentWrong);
    }

  } else if (error?.message) {
    message = error.message;
    errorToaster(message);
  } else {
    errorToaster(errorMessages.somethingWentWrong);
  }

  return { error: message };
};


// const errorHandler = (error: any) => {
//   let message = "";
//   if (error.response) {
//     // const res = error.response.data;
//     if (error.response.status === 401) {
//       if (error.config.url !== "/login") {
//         errorToaster(warningMessages.sessionExpired);
//       }
//       localStorage.clear();
//     } else if(error.response.status === 400) {
//       const errors = error?.response?.data?.error;
//       if(Array.isArray(errors)){
//         errors.forEach((error: any) => {
//           errorToaster(error);
//         });
//       }else{
//         errorToaster(errors?.response?.data?.message);
//       }
//     }
//   } else if (error?.message) {
//     message = error.message;
//     errorToaster(message);
//   }else{
//     errorToaster(errorMessages.somethingWentWrong);
//   }

//   return { error: message };
// };

export const getFilePathWithBackendUrl = (path: any): string => {
  if (typeof path !== "string") {
    return "";
  }

  if (path.includes("http")) {
    return path;
  } else {
    return import.meta.env.VITE_BASE_URL_PREFIX + "/uploads/" + path;
  }
};


