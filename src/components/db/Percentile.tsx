import { useMemo } from "react";
import EChart from "../EChart";
import { metricForPercentile } from "poc-metric";

/**
 * P80,P95 分布图
 * @returns
 */
const Percentile = () => {
  const option = useMemo(() => {
    const xAxisData: number[] = [];
    const P80Data: string[] = [];
    const P95Data: string[] = [];
    metricForPercentile.forEach((p) => {
      const { time, value } = p;
      const { P80, P95 } = value;
      xAxisData.push(time);
      P80Data.push(P80);
      P95Data.push(P95);
    });

    return {
      title: {
        text: "P80、P95分布图",
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
          name: "P80",
          splitLine: {
            show: true,
          },
        },
        {
          type: "value",
          name: "P95",
          splitLine: {
            show: true,
          },
        },
      ],
      series: [
        {
          name: "P80",
          type: "line",
          smooth: true,
          data: P80Data,
        },
        {
          name: "P95",
          type: "line",
          smooth: true,
          yAxisIndex: 1,
          data: P95Data,
        },
      ],
    };
  }, []);

  return <EChart option={option} />;
};

export default Percentile;
