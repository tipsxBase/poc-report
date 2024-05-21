import useLayoutStore from '@/layout/LayoutProvider/hooks/useLayoutStore';

const usePlatformFeature = (key: string) => {
	const { getPlatformFeature } = useLayoutStore();
	return getPlatformFeature(key);
};

export default usePlatformFeature;
