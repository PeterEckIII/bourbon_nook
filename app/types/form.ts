export type FormErrors<T> = {
  [P in keyof T]?: string;
};
