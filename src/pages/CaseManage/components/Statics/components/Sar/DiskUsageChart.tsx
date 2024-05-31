import { forwardRef, useCallback, useImperativeHandle } from "react";
import { Source } from "./shared";
import EChart, { EChartInstance } from "@/components/EChart";
import useRefs from "@/hooks/useRefs";

export interface DiskUsage {
  [key: string]: any;
}

export interface DiskUsageChartProps {
  dimensions: string[];
  source: Array<{
    label: string;
    value: Source<Omit<DiskUsage, "device">>[];
  }>;
}

export interface DiskUsageInstance {
  getImage: () => Record<string, string>;
}

const DiskUsageChart = forwardRef<DiskUsageInstance, DiskUsageChartProps>(
  (props, ref) => {
    const { dimensions, source } = props;

    const { getRef, refKeys } = useRefs<string, EChartInstance>();

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
  }
);

export default DiskUsageChart;
