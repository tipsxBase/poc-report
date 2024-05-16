import { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./index.module.css";
import * as echarts from "echarts";

export interface EChartProps {
  option: echarts.EChartsCoreOption;
}

/**
 *
 */
const EChart = (props: EChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>();
  const { option } = props;
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(wrapperRef.current);
    }
    chartInstance.current.setOption(option);
  }, [option]);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      chartInstance.current?.resize();
    });
  }, []);

  return <div ref={wrapperRef} className={styles.eChart}></div>;
};

export default EChart;
