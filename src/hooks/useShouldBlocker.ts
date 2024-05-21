const shouldBlocker = (
	saveFlag: any, // 点击保存的时候直接返回不拦截
	originTableInfo: any, // 数据表基本信息
	originColumns: any, // 数据表列信息
	form: any, // 表单
	tableId: any, // 表id
	userId: any, // 用户id
	orgId: any, // 组织id
	identifier: string // 区分主数据和数据表
) => {
	if (saveFlag) return false; // 保存的时候不拦截
	const data = form.getFieldsValue() || {};
	const {
		displayName, // 模型中文名
		name, // 模型英文名
		ownerId, // 责任人
		organizationId, // 提供方
		tagIdList, // 资源标签肯定会选上
		assetCatalogIdList, // 关联领域或者关联目录
		bizSystemId, // 业务系统
		description, // 描述
		columnList, // 字段列表
		partitionConfig, // 分区字段配置
		primaryKey // 主键配置
	} = data;
	if (typeof columnList === 'undefined') return true; // 没有字段的空表
	const { columnName, partitionType, interval, intervalType, startTime } =
		partitionConfig;
	if (!tableId) {
		/** 新建主数据模型 */
		const baseCheckFlag =
			displayName ||
			name ||
			ownerId !== userId ||
			organizationId !== orgId ||
			assetCatalogIdList ||
			bizSystemId ||
			description ||
			columnName ||
			partitionType ||
			interval ||
			intervalType ||
			startTime ||
			primaryKey;
		if (baseCheckFlag) return true; // 看看有没有填值
		const columnCheckFlag = columnList.some((column: any) => {
			for (const key in column) {
				const value = column[key];
				if (!!value && key !== 'id') {
					return true; // 看看有没有填值
				}
			}
			return false;
		});
		return columnCheckFlag;
	} else {
		/** 修改主数据模型 */
		const tableInfo: any = originTableInfo || {};
		/** 原始数据 */
		const {
			displayName: originDisplayName, // 模型中文名
			name: originName, // 模型英文名
			ownerId: originOwnerId, // 责任人
			organizationId: originOrganizationId, // 提供方
			tagInfoList: originTagInfoList, // 资源标签是个数组
			catalogIds: originCatalogIds, // 关联领域或者关联目录
			bizSystemId: originBizSystemId, // 业务系统
			description: originDescription, // 描述
			partitionConfig: originPartitionConfig, // 分区字段配置
			primaryKey: originPrimaryKey // 主键配置
		} = tableInfo;
		const baseCheckFlag =
			displayName !== originDisplayName ||
			name !== originName ||
			ownerId !== originOwnerId ||
			organizationId !== originOrganizationId ||
			(identifier === 'master_data'
				? assetCatalogIdList !==
				  (Array.isArray(originCatalogIds) && originCatalogIds[0]) // 相关领域
				: originCatalogIds &&
				  !(
						// originCatalogIds可能会给null
						(
							assetCatalogIdList.length === originCatalogIds.length &&
							assetCatalogIdList.every((tag: any) =>
								originCatalogIds.some((item: any) => item.name === tag.name)
							)
						)
				  )) || // 相关目录
			// eslint-disable-next-line
			bizSystemId != originBizSystemId || // 业务系统非必填
			description !== originDescription ||
			primaryKey !== originPrimaryKey;
		if (baseCheckFlag) return true; // 先看基础的字符串比较
		const tagListCheckFlag =
			tagIdList.length === originTagInfoList.length &&
			tagIdList.every((tag: any) =>
				originTagInfoList.some((item: any) => item.name === tag.name)
			);
		if (!tagListCheckFlag) return true; // 主数据的资源标签比较
		let originColumnName,
			originPartitionType,
			originInterval,
			originIntervalType,
			originStartTime;
		if (!!originPartitionConfig) {
			const { columnName, partitionType, interval, intervalType, startTime } =
				JSON.parse(originPartitionConfig); // 后端返回的字符串
			originColumnName = columnName;
			originPartitionType = partitionType;
			originInterval = interval;
			originIntervalType = intervalType;
			originStartTime = startTime;
		}
		const partitionCheckFlag =
			columnName !== originColumnName ||
			partitionType !== originPartitionType ||
			interval !== originInterval ||
			intervalType !== originIntervalType ||
			startTime !== originStartTime;
		if (partitionCheckFlag) return true; // 分区字段配置比较
		const originColumnList = originColumns;
		const columnCheckFlag =
			columnList.length === originColumnList.length &&
			columnList.every((column: any) => {
				const originColumn = originColumnList.find(
					(item: any) => item.id === column.id
				);
				if (!originColumn) return false; // 找不到对应列
				for (const key in column) {
					const value = column[key];
					const originValue = originColumn[key];
					if (key === 'masterDataColumn') {
						// 引用的主数据是个对象
						const { id } = value || {}; // value可能是null
						if (id !== originValue?.id) {
							return false; // 找不同
						}
					} else {
						if (value !== originValue) {
							return false; // 找不同
						}
					}
				}
				return true;
			});
		if (!columnCheckFlag) return true;
		return false;
	}
};

export default shouldBlocker;
