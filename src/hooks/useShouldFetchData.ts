import { usePrevious } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Options {
	outlet?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
	reloadList: (params?: any) => void;
}

function useShouldFetchData(options: Options) {
	const { reloadList } = options;
	const [pathname, setPathname] = useState<string>(null);
	const prevPathname = usePrevious<string>(pathname);
	const location = useLocation();

	useEffect(() => {
		setPathname(location.pathname);
	}, [location]);

	const reloadListRef = useRef(reloadList);
	reloadListRef.current = reloadList;

	useEffect(() => {
		if (!!pathname && !!prevPathname && prevPathname.includes(pathname)) {
			reloadListRef.current();
		}
	}, [prevPathname, pathname]);
}

export default useShouldFetchData;
