import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import EChart, { EChartInstance } from "@/components/EChart";
import "./index.less";
import useCaseStore from "@/stores/case";
import { CaseEntity, CaseMetric } from "@/service/case";

export interface QpsProps {
  rawEntity: CaseEntity;
}

export interface QpsInstance {
  getImage: () => Record<string, string>;
}

const formatNumber = (value: number) => {
  const v = Math.round(value);
  return isNaN(v) ? "暂无数据" : v;
};

const Qps = forwardRef<QpsInstance, QpsProps>((props, ref) => {
  const { rawEntity } = props;
  const { case_id } = rawEntity;
  const [metric, setMetric] = useState<CaseMetric>({} as any);
  const [snapshot, setSnapshot] = useState<CaseMetric[]>([]);
  const { selectMetrics } = useCaseStore();
  const echartInstance = useRef<EChartInstance>();
  const { xAxis, statementQpsValue, sqlQpsValue } = useMemo(() => {
    const xAxis = [];
    const statementQpsValue = [];
    const sqlQpsValue = [];
    snapshot.forEach((s, i) => {
      const { statement_qps, sql_qps } = s;
      xAxis.push(i);
      statementQpsValue.push(statement_qps);
      sqlQpsValue.push(sql_qps);
    });

    return {
      xAxis,
      statementQpsValue,
      sqlQpsValue,
    };
  }, [snapshot]);

  useEffect(() => {
    selectMetrics(case_id).then((res) => {
      if (!res || res.length === 0) {
        return;
      }
      setSnapshot(res);
      setMetric(res[res.length - 1]);
    });
  }, [case_id, selectMetrics]);

  useImperativeHandle(
    ref,
    () => {
      return {
        getImage: () => {
          return { qps: echartInstance.current.getImage() };
        },
      };
    },
    []
  );

  const option = {
    title: {
      text: "TPS分布图",
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
      data: xAxis,
    },
    yAxis: [
      {
        type: "value",
        nam: "事务数",
        splitLine: {
          show: true,
        },
      },
      {
        type: "value",
        name: "SQL数",
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "每秒事务数分布图",
        type: "line",
        smooth: true,
        data: statementQpsValue,
      },
      {
        name: "每秒执行SQL数量分布图",
        type: "line",
        smooth: true,
        yAxisIndex: 1,
        data: sqlQpsValue,
      },
    ],
  };

  return (
    <div className="qps">
      <div className="statics">
        <p>
          每条SQL平均耗时(ms)：
          <span>{formatNumber(metric.avg_sql_cast_mills)}</span>
        </p>
        <p>
          每个事务平均耗时(ms)：
          <span>{formatNumber(metric.avg_statement_cast_mills)}</span>
        </p>
        <p>
          P80(ms)：
          <span>{formatNumber(metric.p80)}</span>
        </p>
        <p>
          P95(ms)：
          <span>{formatNumber(metric.p95)}</span>
        </p>
      </div>
      <EChart ref={echartInstance} option={option} />
    </div>
  );
});

export default Qps;
