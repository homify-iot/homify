export type State = boolean | number | { value: string, unit: string };
export interface StateInfo {
  state: State;
  last_update: Date;
}

export interface StatePool {
  [key: string]: StateInfo;
}
export interface OnlinePool {
  [key: string]: boolean;
}

export interface EntityObject {
  entityId: string;
  name: string;
  icon: string;
  image: string;
  type: string;
}