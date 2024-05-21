import { useMemoizedFn } from 'ahooks';
import useMobxStore from '@/store';

export type LifecycleCallback = (forceDelete?: boolean) => Promise<any>;

const useTabLifecycle = () => {
	const { EtlProcessingStore } = useMobxStore();
	const { lifecycle } = EtlProcessingStore;

	const register = useMemoizedFn((id, callback: LifecycleCallback) => {
		if (id === null || id === undefined || id === '') {
			console.warn('[LuBan] useTabLifecycle 在注册生命周期时，id不能为空！');
			return;
		}
		lifecycle.set(id, callback);

		return () => {
			lifecycle.delete(id);
		};
	});

	const getLifecycle = useMemoizedFn((id) => {
		if (lifecycle.has(id)) {
			return lifecycle.get(id);
		}
		return null;
	});

	return [register, getLifecycle] as [
		(id: any, callback: LifecycleCallback) => () => void,
		(id: any) => LifecycleCallback
	];
};

export default useTabLifecycle;
