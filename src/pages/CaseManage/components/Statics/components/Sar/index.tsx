import { Source, omit, parseSource, praseArrayUsage } from "./shared";
import { CpuUsage, CpuUsageChart } from "./CpuUsageChart";
import { useEffect, useMemo, useState } from "react";
import MemoryUsageChart, { MemoryUsage } from "./MemoryUsageChart";
import DiskUsageChart, { DiskUsage } from "./DiskUsageChart";
import NetworkUsageChart, { NetworkUsage } from "./NetworkUsageChart";
import { CaseEntity, CaseStatic, StaticType } from "@/service/case";
import useCaseStore from "@/stores/case";

export interface SarProps {
  rawEntity: CaseEntity;
}

const Sar = (props: SarProps) => {
  const [metricForSar, setMetricForSar] = useState<CaseStatic[]>([]);

  const { rawEntity } = props;

  const { case_id } = rawEntity;

  const { selectStatics } = useCaseStore();

  const {
    cpuDimensions,
    cpuSource,
    memoryDimensions,
    memorySource,
    diskUsageDimensions,
    diskUsageDimensionsSources,
    networkUsageDimensions,
    networkUsageDimensionsSources,
  } = useMemo(() => {
    const cpuDimensions = [
      "time",
      "user",
      "nice",
      "system",
      "iowait",
      "steal",
      "idle",
    ];

    const memoryDimensions = [
      "time",
      "kbmemfree",
      "kbavail",
      "kbmemused",
      "memused",
      "kbbuffers",
      "kbcached",
      "kbcommit",
      "commit",
      "kbactive",
      "kbinact",
      "kbdirty",
    ];

    const diskUsageDimensions = [
      "time",
      "tps",
      "rdSecPerSec",
      "wrSecPerSec",
      "avgrqSz",
      "avgquSz",
      "await",
      "svctm",
      "util",
    ];

    const networkUsageDimensions = [
      "time",
      "rxpckPerSec",
      "txpckPerSec",
      "rxkBPerSec",
      "txkBPerSec",
      "rxcmpPerSec",
      "txcmpPerSec",
      "rxmcstPerSec",
    ];

    const diskUsageDimensionsSources: Array<{
      label: string;
      value: Source<Omit<DiskUsage, "device">>[];
    }> = [];

    const networkUsageDimensionsSources: Array<{
      label: string;
      value: Source<Omit<NetworkUsage, "iface">>[];
    }> = [];

    const cpuSource: Source<Omit<CpuUsage, "cpu">>[] = [];
    const memorySource: Source<MemoryUsage>[] = [];
    metricForSar.forEach((m) => {
      const { time, value } = m;
      const { cpuUsages, memoryUsage, diskUsages, networkUsages } = JSON.parse(
        JSON.parse(value)
      );
      parseSource(cpuSource, time, omit(cpuUsages, "cpu"));
      parseSource(memorySource, time, memoryUsage);
      praseArrayUsage(diskUsageDimensionsSources, "device", time, diskUsages);
      praseArrayUsage(
        networkUsageDimensionsSources,
        "iface",
        time,
        networkUsages
      );
    });
    return {
      cpuDimensions,
      cpuSource,
      memoryDimensions,
      memorySource,
      diskUsageDimensions,
      diskUsageDimensionsSources,
      networkUsageDimensions,
      networkUsageDimensionsSources,
    };
  }, [metricForSar]);

  useEffect(() => {
    selectStatics(case_id, StaticType.ECS_SAR).then((res) => {
      setMetricForSar(res);
    });
  }, [case_id, selectStatics]);

  return (
    <div>
      <CpuUsageChart dimensions={cpuDimensions} source={cpuSource} />
      <MemoryUsageChart dimensions={memoryDimensions} source={memorySource} />
      <DiskUsageChart
        dimensions={diskUsageDimensions}
        source={diskUsageDimensionsSources}
      />
      <NetworkUsageChart
        dimensions={networkUsageDimensions}
        source={networkUsageDimensionsSources}
      />
    </div>
  );
};

export default Sar;
