export interface StateInfo {
  state: boolean;
  last_update: Date;
}

export interface StatePool {
  [key: string]: StateInfo;
}
export interface OnlinePool {
  [key: string]: boolean;
}