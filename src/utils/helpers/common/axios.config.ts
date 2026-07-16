import axios from "axios";

// In dev, use Vite proxy (/api → VITE_BASE_URL_PREFIX) to avoid browser CORS errors.
axios.defaults.baseURL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_BASE_URL_PREFIX;

export default axios;