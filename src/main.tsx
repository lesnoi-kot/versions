import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import "tippy.js/dist/tippy.css";

import { APIContext } from "./context/api";
import { API } from "./api";
import App from "./App.tsx";

import "./index.css";

const queryClient = new QueryClient();

const apiService = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <APIContext.Provider value={apiService}>
      <App />
    </APIContext.Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);
