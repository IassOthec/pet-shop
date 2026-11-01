import { useCallback, useEffect, useRef, useState } from "react";

let nextId = 0;

export const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = "success") => {
      const id = (nextId += 1);

      setToasts((current) => [...current, { id, message, type }]);

      const timer = setTimeout(() => dismiss(id), 4800);
      timers.current.set(id, timer);

      return id;
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      for (const timer of timers.current.values()) {
        clearTimeout(timer);
      }

      timers.current.clear();
    },
    [],
  );

  return { toasts, notify, dismiss };
};
