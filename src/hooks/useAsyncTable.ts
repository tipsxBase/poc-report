import { useCallback, useEffect, useRef, useState } from 'react';
import { PAGINATION_SIZE_OPTIONS } from '@/constants';
import { TableProps, PaginationProps } from '@arco-design/web-react';
import { LuBanResponse } from '@/service/xhr/fetch';
import { useUpdateEffect } from 'ahooks';

export interface PageParams {
	page: number;
	pageSize: number;
}

export interface ParamsType {
	[key: string]: any;
	page?: never;
	pageSize?: never;
}

export const defaultPage = {
	page: 1,
	pageSize: 10
};

export interface Options<T extends ParamsType, D = any> {
	params?: T;
	defaultPageSize?: number;
	tableDataRequest: (params: T & PageParams) => Promise<LuBanResponse<D[]>>;
	hasParamsChanged?: (params: T) => boolean;
}

export interface ReturnResult<D> {
	tableProps: Omit<TableProps<D>, 'loading'> & {
		loading: boolean;
	};
	pagination: PaginationProps;
	reloadList: (type?: ReloadType) => void;
}

type ReloadType = 'remove';

const defaultParams = {};

function useAsyncTable<T extends ParamsType, D = any>(
	options: Options<T, D>
): ReturnResult<D> {
	const {
		params = defaultParams,
		tableDataRequest,
		hasParamsChanged = () => true,
		defaultPageSize
	} = options;
	const paramsRef = useRef(params);
	const [loading, setLoading] = useState(true);
	const defaultPageRef = useRef({
		...defaultPage
	});
	defaultPageRef.current.pageSize =
		defaultPageSize || defaultPageRef.current.pageSize;

	paramsRef.current = params;
	// 分页参数
	const [paginationParams, setPaginationParams] = useState<PageParams>(() => {
		if (defaultPageSize) {
			return {
				...defaultPage,
				pageSize: defaultPageSize
			};
		} else {
			return defaultPage;
		}
	});
	// 分页，从接口返回用于table page
	const [paginationProps, setPaginationProps] = useState({
		pageSize: 10,
		current: 1,
		total: 0
	});

	const hasParamsChangedRef = useRef(hasParamsChanged);
	hasParamsChangedRef.current = hasParamsChanged;

	const tableDataRequestRef = useRef(tableDataRequest);
	tableDataRequestRef.current = tableDataRequest;

	const [list, setList] = useState<D[]>([]);

	const getList = useCallback(() => {
		if (!hasParamsChangedRef.current(paramsRef.current as T)) {
			setList([]);
			setPaginationParams(defaultPageRef.current);
			setLoading(false);
			return;
		}
		setLoading(true);
		tableDataRequestRef
			.current({
				...paramsRef.current,
				...paginationParams
			} as T & PageParams)
			.then((data) => {
				const { total, data: list, current, pageSize } = data;
				setPaginationProps({
					current,
					pageSize,
					total
				});
				setList(list);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [paginationParams]);

	useUpdateEffect(() => {
		setPaginationParams((p) => ({
			...p,
			page: 1
		}));
	}, [params]);

	useEffect(() => {
		getList();
	}, [getList]);

	const reloadList = (type?: ReloadType) => {
		if (type === 'remove') {
			if (list.length === 1) {
				return setPaginationParams((p) => ({
					page: p.page === 1 ? 1 : p.page - 1,
					pageSize: p.pageSize
				}));
			}
		}
		getList();
	};

	return {
		tableProps: {
			border: false,
			data: list,
			loading
		},
		pagination: {
			sizeOptions: PAGINATION_SIZE_OPTIONS,
			...paginationProps,
			onChange: (page, pageSize) => {
				setPaginationParams({
					page,
					pageSize
				});
			},
			onPageSizeChange: (pageSize) => {
				setPaginationParams({
					page: 1,
					pageSize
				});
			}
		},
		reloadList
	};
}

export default useAsyncTable;
