import { forwardRef, useCallback, useImperativeHandle } from "react";
import { Source } from "./shared";
import EChart, { EChartInstance } from "@/components/EChart";
import useRefs from "@/hooks/useRefs";

export interface NetworkUsage {
  [key: string]: any;
}

export interface NetworkUsageChartProps {
  dimensions: string[];
  source: Array<{
    label: string;
    value: Source<Omit<NetworkUsage, "iface">>[];
  }>;
}

export interface NetworkUsageInstance {
  getImage: () => Record<string, string>;
}

const NetworkUsageChart = forwardRef<
  NetworkUsageInstance,
  NetworkUsageChartProps
>((props, ref) => {
  const { dimensions, source } = props;
  const { getRef, refKeys } = useRefs<string, EChartInstance>();

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

  useImperativeHandle(
    ref,
    () => {
      return {
        getImage: () => {
          return refKeys.reduce((prev, current) => {
            prev[current] = getRef(current).current.getImage();
            return prev;
          }, {} as Record<string, any>);
        },
      };
    },
    [getRef, refKeys]
  );

  return (
    <div>
      {source.map((s, index) => (
        <EChart
          ref={getRef(s.label)}
          key={index}
          option={generateOption(dimensions, s)}
        />
      ))}
    </div>
  );
});

export default NetworkUsageChart;
