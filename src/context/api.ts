import React from "react";
import { API } from "api";

export const APIContext = React.createContext<API | null>(null);

export function useAPI(): API {
  const maybeApi = React.useContext(APIContext);

  if (!maybeApi) {
    throw new Error("API context value not found");
  }

  return maybeApi;
}
