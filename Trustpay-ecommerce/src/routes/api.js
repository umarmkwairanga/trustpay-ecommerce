import axios from "axios";

const API = axios.create({
  baseURL: window.location.origin, // Dynamic baseline to bypass cross-origin blocks
});

// Force explicit default export for your JSX components
export default API;