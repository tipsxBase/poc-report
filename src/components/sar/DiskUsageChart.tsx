import { useCallback } from "react";
import { Source } from "./shared";
import EChart from "../EChart";

export interface DiskUsageChartProps {
  dimensions: string[];
  source: Array<{
    label: string;
    value: Source<Omit<DiskUsage, "device">>[];
  }>;
}

const DiskUsageChart = (props: DiskUsageChartProps) => {
  const { dimensions, source } = props;

  const generateOption = useCallback(
    (
      dimensions: string[],
      source: {
        label: string;
        value: Array<Source<Omit<DiskUsage, "device">>>;
      }
    ) => {
      return {
        title: {
          text: `磁盘${source.label}指标分布图`,
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
          source: source.value,
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
        ],
      };
    },
    []
  );

  return (
    <div>
      {source.map((s, index) => (
        <EChart key={index} option={generateOption(dimensions, s)} />
      ))}
    </div>
  );
};

export default DiskUsageChart;
