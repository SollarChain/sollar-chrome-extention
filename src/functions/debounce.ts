type Voidify<T extends (...args: any) => any> = (...args: Parameters<T>) => void

export const debounce = <T extends (...args: any) => void>(action: T, time: number): Voidify<T> => {
  let timeout = null as any | null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    // @ts-ignore
    timeout = setTimeout(() => action(...args), time);
  };
};
