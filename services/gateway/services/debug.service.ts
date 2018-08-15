import debug from "debug";

export const createDebug = (namespace: string) => {
  const key = "homify:" + namespace;
  return debug(key);
} 