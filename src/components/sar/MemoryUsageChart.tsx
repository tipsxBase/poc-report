import { useMemo } from "react";
import { Source } from "./shared";
import EChart from "../EChart";

export interface MemoryUsageChartProps {
  dimensions: string[];
  source: Source<MemoryUsage>[];
}

export const MemoryUsageChart = (props: MemoryUsageChartProps) => {
  const { dimensions, source } = props;

  const option = useMemo(() => {
    return {
      title: {
        text: "内存指标分布图",
        left: "center",
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
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
      dataset: {
        dimensions: dimensions,
        source: source,
      },
      xAxis: { type: "category" },
      yAxis: {},
      series: [
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
        { type: "line" },
      ],
    };
  }, [dimensions, source]);

  return <EChart option={option} />;
};

export default MemoryUsageChart;
