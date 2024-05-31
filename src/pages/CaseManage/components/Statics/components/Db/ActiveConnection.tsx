import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import EChart, { EChartInstance } from "@/components/EChart";
import { CaseEntity, CaseStatic, StaticType } from "@/service/case";
import useCaseStore from "@/stores/case";

export interface ActiveConnectionProps {
  rawEntity: CaseEntity;
}

export interface ActiveConnectionInstance {
  getImage: () => Record<string, string>;
}

const ActiveConnection = forwardRef<
  ActiveConnectionInstance,
  ActiveConnectionProps
>((props, ref) => {
  const { rawEntity } = props;
  const echartInstance = useRef<EChartInstance>();
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
      if (!res || res.length === 0) {
        return;
      }
      setMetricForActiveConnection(res);
    });
  }, [case_id, selectStatics]);

  useImperativeHandle(
    ref,
    () => {
      return {
        getImage: () => {
          return { activeConnection: echartInstance.current.getImage() };
        },
      };
    },
    []
  );

  return <EChart ref={echartInstance} option={option} />;
});

export default ActiveConnection;
