import { useEffect, useMemo, useState } from "react";
import EChart from "../EChart";
import SQLite from "@/shared/Sqlite";

const ActiveConnection = () => {
  const [metricForActiveConnection, setMetricForActiveConnection] = useState(
    []
  );
  const option = useMemo(() => {
    const xAxisData: number[] = [];
    const activeConnectionsData: number[] = [];
    metricForActiveConnection.forEach((p) => {
      const { time, value } = p;
      const { activeConnections } = JSON.parse(value);
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
    SQLite.open().then((db) => {
      db.queryWithArgs("SELECT * FROM poc_active_connections").then((c) => {
        setMetricForActiveConnection(c as any);
      });
    });
  }, []);

  return <EChart option={option} />;
};

export default ActiveConnection;
