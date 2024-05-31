import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import styles from "./index.module.css";
import * as echarts from "echarts";

export interface EChartProps {
  option: echarts.EChartsCoreOption;
}

export interface EChartInstance {
  getImage: () => string;
}

/**
 *
 */
const EChart = forwardRef<EChartInstance, EChartProps>((props, ref) => {
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

  useImperativeHandle(
    ref,
    () => {
      return {
        getImage: () => {
          return chartInstance.current?.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff",
          });
        },
      };
    },
    []
  );

  return <div ref={wrapperRef} className={styles.eChart}></div>;
});

export default EChart;
