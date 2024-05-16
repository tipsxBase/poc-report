import { useEffect, useMemo, useState } from "react";
import EChart from "../EChart";
import "./index.less";
import SQLite from "@/shared/Sqlite";
const Qps = () => {
  const [metric, setMetric] = useState({} as any);
  const [snapshot, setSnapshot] = useState([]);

  const { xAxis, statementQpsValue, sqlQpsValue } = useMemo(() => {
    const xAxis = [];
    const statementQpsValue = [];
    const sqlQpsValue = [];
    snapshot.forEach((s, i) => {
      const { statementQps, sqlQps } = s;
      xAxis.push(i);
      statementQpsValue.push(statementQps);
      sqlQpsValue.push(sqlQps);
    });

    return {
      xAxis,
      statementQpsValue,
      sqlQpsValue,
    };
  }, [snapshot]);

  useEffect(() => {
    SQLite.open().then((db) => {
      Promise.all([
        db.queryWithArgs("SELECT * FROM poc_metric limit 1"),
        db.queryWithArgs("SELECT * FROM poc_metric_snapshot"),
      ]).then(([metric, snapshot]) => {
        console.log("metric", metric);
        if ((metric as any).length > 0) {
          setMetric(metric[0]);
        }
        setSnapshot(snapshot as any);
      });
    });
  }, []);

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
          每秒SQL数平均数：<span>{Math.round(metric.sqlQps)}</span>
        </p>
        <p>
          每秒事务数平均数：<span>{Math.round(metric.statementQps)}</span>
        </p>
        <p>
          每条SQL平均耗时(ms)：<span>{Math.round(metric.avgSqlCastMills)}</span>
        </p>
        <p>
          每个事务平均耗时(ms)：
          <span>{Math.round(metric.avgStatementCastMills)}</span>
        </p>
        <p>
          P80(ms)：
          <span>{Math.round(metric.p80)}</span>
        </p>
        <p>
          P95(ms)：
          <span>{Math.round(metric.p95)}</span>
        </p>
      </div>
      <EChart option={option} />
    </div>
  );
};

export default Qps;
