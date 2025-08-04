import { createContext } from "react";

export const DownloadContext = createContext({
  downloadMode: false,
  setDownloadMode: () => {},
});

