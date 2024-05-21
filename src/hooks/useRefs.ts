import { RefObject, createRef, useCallback, useRef } from 'react';

const useRefs = <K, T>() => {
	const cached = useRef<Map<K, RefObject<T>>>(new Map());

	const getRef = useCallback((key: K) => {
		if (cached.current.has(key)) {
			return cached.current.get(key);
		} else {
			const instance = createRef<T>();
			cached.current.set(key, instance);
			return instance;
		}
	}, []);

	const removeRef = useCallback((key: K) => {
		if (cached.current.has(key)) {
			return cached.current.delete(key);
		}
	}, []);
	return { getRef, removeRef };
};

export default useRefs;
