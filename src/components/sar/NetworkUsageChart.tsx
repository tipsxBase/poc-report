import { useCallback } from "react";
import { Source } from "./shared";
import EChart from "../EChart";

export interface NetworkUsageChartProps {
  dimensions: string[];
  source: Array<{
    label: string;
    value: Source<Omit<NetworkUsage, "iface">>[];
  }>;
}

const NetworkUsageChart = (props: NetworkUsageChartProps) => {
  const { dimensions, source } = props;

  const generateOption = useCallback(
    (
      dimensions: string[],
      source: {
        label: string;
        value: Array<Source<Omit<NetworkUsage, "iface">>>;
      }
    ) => {
      return {
        title: {
          text: `网络${source.label}指标分布图`,
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

export default NetworkUsageChart;
