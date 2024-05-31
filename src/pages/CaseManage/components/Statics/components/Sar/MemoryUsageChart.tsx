import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Source } from "./shared";
import EChart, { EChartInstance } from "@/components/EChart";

export interface MemoryUsage {
  [key: string]: any;
}

export interface MemoryUsageChartProps {
  dimensions: string[];
  source: Source<MemoryUsage>[];
}

export interface MemoryUsageInstance {
  getImage: () => Record<string, string>;
}

export const MemoryUsageChart = forwardRef<
  MemoryUsageInstance,
  MemoryUsageChartProps
>((props, ref) => {
  const { dimensions, source } = props;
  const echartInstance = useRef<EChartInstance>();

  const option = useMemo(() => {
    return {
      title: {
        text: "内存指标分布图",
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

  useImperativeHandle(ref, () => {
    return {
      getImage: () => {
        return { memoryUsage: echartInstance.current.getImage() };
      },
    };
  });

  return <EChart ref={echartInstance} option={option} />;
});

export default MemoryUsageChart;
