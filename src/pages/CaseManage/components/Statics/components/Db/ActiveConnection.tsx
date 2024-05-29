import { useEffect, useMemo, useState } from "react";
import EChart from "@/components/EChart";
import { CaseEntity, CaseStatic, StaticType } from "@/service/case";
import useCaseStore from "@/stores/case";

export interface ActiveConnectionProps {
  rawEntity: CaseEntity;
}

const ActiveConnection = (props: ActiveConnectionProps) => {
  const { rawEntity } = props;

  const { case_id } = rawEntity;

  const [metricForActiveConnection, setMetricForActiveConnection] = useState<
    CaseStatic[]
  >([]);

  const { selectStatics } = useCaseStore();

  const option = useMemo(() => {
    const xAxisData: number[] = [];
    const activeConnectionsData: number[] = [];
    metricForActiveConnection.forEach((p) => {
      const { time, value } = p;
      const { activeConnections } = JSON.parse(JSON.parse(value));
      xAxisData.push(time);
      activeConnectionsData.push(activeConnections);
    });

    return {
      title: {
        text: "活跃连接数分布图",
        left: "center",
      },
      legend: {
        top: 50,
      },
      tooltip: {
        trigger: "axis",
      },
      grid: {
        top: 100,
        left: "20",
        right: "20",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        splitLine: {
          show: true,
        },
        data: xAxisData,
      },
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "活跃连接数",
          type: "line",
          smooth: true,
          data: activeConnectionsData,
        },
      ],
    };
  }, [metricForActiveConnection]);

  useEffect(() => {
    selectStatics(case_id, StaticType.ACTIVE_CONNECTION).then((res) => {
      setMetricForActiveConnection(res);
    });
  }, [case_id, selectStatics]);

  return <EChart option={option} />;
};

export default ActiveConnection;
