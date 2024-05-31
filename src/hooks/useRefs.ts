import { RefObject, createRef, useCallback, useRef, useState } from "react";

const useRefs = <K, T>() => {
  const cached = useRef<Map<K, RefObject<T>>>(new Map());

  const [refKeys, setRefKeys] = useState<K[]>([]);

  const getRef = useCallback((key: K) => {
    if (cached.current.has(key)) {
      return cached.current.get(key);
    } else {
      const instance = createRef<T>();
      cached.current.set(key, instance);
      setRefKeys((keys) => keys.concat(key));
      return instance;
    }
  }, []);

  const removeRef = useCallback((key: K) => {
    if (cached.current.has(key)) {
      setRefKeys((keys) => keys.filter((k) => k !== key));
      return cached.current.delete(key);
    }
  }, []);
  return { getRef, removeRef, refKeys };
};

export default useRefs;
