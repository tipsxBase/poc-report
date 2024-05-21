import { useMemoizedFn, useMount } from 'ahooks';
import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const useBrowserParams: <T = any>() => [T, () => void] = <T = any>() => {
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const pathname = location.pathname;
	const key = searchParams.get('k');
	const [params, setParams] = useState<T>(() => {
		const paramsString = sessionStorage.getItem(key);
		if (paramsString) {
			const innerParams = JSON.parse(paramsString);
			const { __pathname__, ...rest } = innerParams;
			if (pathname !== __pathname__) {
				return null;
			}
			return rest as T;
		}
		return null;
	});

	useMount(() => {
		if (!key) {
			return;
		}
		sessionStorage.removeItem(key);
		window.history.replaceState(null, undefined, pathname);
	});

	const clearParams = useMemoizedFn(() => {
		setParams(null);
	});

	return [params, clearParams];
};

export default useBrowserParams;
