export const DATE_FORMAT = 'DD-MM-yyyy';
export const TIME_FORMAT = 'hh:mm:ss';

export interface Store {
  [key: string]: Rating[]
}

export interface Rating {
  date: string,
  time: string,
  value: number
}
