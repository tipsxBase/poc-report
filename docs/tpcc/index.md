# TPC-C 最佳实践

## TPC-C 概述

TPC-C 是专门针对联机交易处理系统（OLTP 系统）的规范，也被称为业务处理系统规范。该规范由事务处理性能委员会（Transaction Processing Performance Council，简称 TPC）制定，TPC 是一个由数十家会员公司创建的非盈利组织，主要负责制定商务应用基准程序的标准规范、性能和价格度量，并管理测试结果的发布。 测试目标是通过模拟一个具有高并发、复杂事务的在线事务处理系统，评估计算机系统处理并发事务的能力。

**官网** ：https://www.tpc.org/tpcc/default5.asp

## 测试模型

TPC-C 测试用到的模型是一个大型的商品批发销售公司，该公司拥有若干个分布在不同区域的商品仓库。当业务扩展时，公司会添加新的仓库。每个仓库负责为 10 个销售点供货，每个销售点为 3000 个客户提供服务。每个客户提交的订单中，平均每个订单有 10 项产品，所有订单中约 1%的产品在其直接所属的仓库中没有存货，必须由其他区域的仓库来供货。同时，每个仓库都要维护公司销售的 100,000 种商品的库存记录。

![Pasted image 20240829173243.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/975c90df-34fa-46d1-b609-4f764b6f0024.png)

## 测试事务说明

TPC-C 测试系统需要处理的交易事务主要包括以下几种：

1. **新订单（New-Order）**：客户输入一笔新的订货交易。
2. **支付操作（Payment）**：更新客户账户余额以反映其支付状况。
3. **发货（Delivery）**：发货（模拟批处理交易）。
4. **订单状态查询（Order-Status）**：查询客户最近交易的状态。
5. **库存状态查询（Stock-Level）**：查询仓库库存状况，以便能够及时补货。

## 测试指标

### 1. 流量指标（Throughput，简称 tpmC）：

- 定义：按照 TPC 组织的定义，流量指标描述了系统在执行支付操作、订单状态查询、发货和库存状态查询这 4 种交易的同时，每分钟可以处理多少个新订单交易。
- 评估标准：所有交易的响应时间必须满足 TPC-C 测试规范的要求，且各种交易数量所占的比例也应该满足 TPC-C 测试规范的要求。流量指标值越大，说明系统的联机事务处理能力越高。

### 2. 性价比（Price/Performance，简称 Price/tpmC）：

- 定义：即测试系统的整体价格（单位为美元）与流量指标的比值。
- 评估标准：在获得相同的 tpmC 值的情况下，价格越低越好。

## 测试工具

我们使用  BenchmarkSQL  来作为  TPC-C  测试工具，BenchmarkSQL 是一款用于数据库性能测试的开源工具，它遵循 TPC-C（Transaction Processing Performance Council-C）规范来模拟一个订单处理系统的工作负载，以便对关系型数据库进行压力测试和性能评估。

## 测试流程

![Pasted image 20240829182611.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/7a189374-454c-4c7b-91b3-109c99f72dac.png)

**安装**

需要准备一个独立于数据库服务器的负载机进行 TPC-C 测试，以免对数据库实际性能表现有影响。负载机建议 4C8G 以上的配置。

**依赖工具包**

> OpenJDK >=17 BenchmarkSQL >=5.0 nmon >=16 ant

**工具包下载**

BenchmarkSQL  工具包下载链接：[https://codeup.aliyun.com/634e0c6267fa83af64bd0235/hexadb/db-test/benchmarksql-5.0/repository/archive.zip?spm=a2cl9.codeup_devops2020_goldlog_projectFiles.0.0.42e87e6azSp1zH&ref=main](https://codeup.aliyun.com/634e0c6267fa83af64bd0235/hexadb/db-test/benchmarksql-5.0/repository/archive.zip?spm=a2cl9.codeup_devops2020_goldlog_projectFiles.0.0.42e87e6azSp1zH&ref=main)

> 无下载权限联系  @李兆伟

[请至钉钉文档查看附件《benchmarksql-5.0.tar》](https://alidocs.dingtalk.com/i/nodes/ndMj49yWjjggvKXDtrpRAQM9W3pmz5aA?iframeQuery=anchorId%3DX02m0gjtcw4gzc61q6h0rt)

服务器性能监控工具 Nmon 下载：

https://nmon.sourceforge.io/pmwiki.php?n=Site.Download

[请至钉钉文档查看附件《nmon16p_32_binaries_feb_2024.tar.gz》](https://alidocs.dingtalk.com/i/nodes/ndMj49yWjjggvKXDtrpRAQM9W3pmz5aA?iframeQuery=anchorId%3DX02m0gju3n73o195cyc005)

JDK  下载

https://mirror.tuna.tsinghua.edu.cn/Adoptium/17/jdk/x64/linux/OpenJDK17U-jdk\_x64\_linux\_hotspot\_17.0.12\_7.tar.gz

[请至钉钉文档查看附件《OpenJDK17U-jdk_x64_linux_hotspot_17.0.12_7.tar.gz》](https://alidocs.dingtalk.com/i/nodes/ndMj49yWjjggvKXDtrpRAQM9W3pmz5aA?iframeQuery=anchorId%3DX02m0gjugovj7f0b93qef)

**上传及解压**

使用 Ftp  工具或者使用  `scp`  命令上传到负载机。  上传后服务器安装包示例： ![Pasted image 20240829182704.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/d825e725-e786-46bf-8b32-693a7c2ba83a.png)

解压

```shell
mkdir -p /data/tpc-c/nmon
mkdir -p /data/tpc-c/benchmark
mkdir -p /data/tpc-c/jdk

echo "解压benchmark"
tar -xvf /data/software/benchmarksql-5.0.tar -C /data/tpc-c/benchmark/
mv /data/tpc-c/benchmark/benchmark-5.0-main*/* /data/tpc-c/benchmark/
rm -rf benchmarksql-5.0-main*

echo "解压nmon"
tar -xvf /data/software/nmon*.tar.gz -C /data/tpc-c/nmon/
## 注意对应的操作系统
mv /data/tpc-c/nmon/nmon_x86_64_centos7 /data/tpc-c/nmon/nmon
echo "解压jdk"
tar -xvf /data/software/OpenJDK17U-jdk_x64_linux_hotspot_17.0.12_7.tar.gz -C /data/tpc-c/jdk/
mv /data/tpc-c/jdk/jdk-17*/* /data/tpc-c/jdk/
rm -rf jdk-17*

```

**安装**

```shell
echo "export JAVA_HOME=/data/tpc-c/jdk" >>/etc/profile
echo "export PATH=$JAVA_HOME/bin:/data/tpc-c/nmon:$PATH" >> /etc/profile

source /etc/profile

yum install -y ant

cd /data/tpc-c/benchmark & ant
```

**配置**

进行数据库连接配置，配置文件位置示例： ![Pasted image 20240829195249.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/4b89fa19-e3e0-444a-8381-53232783e02c.png)

使用  `vi`  或  `vim`命令   编辑配置文件 关键配置项如下： ![Pasted image 20240829195513.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/3975841c-6982-4b14-ad2c-9b0cbad135f2.png)

1. db :  数据库类型

   1. 海纳：hexadb
   2. PostgreSQL: postgres
   3. Oracle: oracle

2. driver:  数据库连接驱动
3. conn:  数据库连接字符串，注意数据库地址端口
4. user:  数据库用户名
5. password:  数据库用户密码
6. warehouses:  数仓数量，要测试的数据量
7. loadWorkers:  数仓加载线程数量，过大会导致数据库负载超限，根据数据实际负载能力进行设置，建议值  30-50
8. terminals: TPC-C  测试并发数量  300-1000  根据数据库实际负载进行配置
9. runMins:  测试运行时长  10-20

> 注意  conn  中   指定数据库名  ，也可以在连接串中指定 schema 建议创建测试数据库 tpcc

**数据库参数配置**

对数据库参数进行调优，以发挥数据库最大性能表现。

**general**

服务器使用  `vi`  命令

```shell
mkdir -p /data/performance
vi /data/performance/general_guc.sh
```

把以下脚本拷贝文件中

```sh

cat <<__CN_END__ > cn_guc.$$
bypass_workload_manager | on
checkpoint_segments     | 128
effective_cache_size    | '1GB'
enable_codegen          | on
enable_orc_cache        | off
enable_stream_operator  | off
enable_wdr_snapshot     | on
instr_unique_sql_count  | 200000
local_syscache_threshold| '16MB'
maintenance_work_mem    | '256MB'
max_active_statements   | -1
max_connections         | 4000
max_coordinators        | 128
max_datanodes           | 256
max_files_per_process   | 1024
max_pool_size           | 8192
max_replication_slots   | 20
max_size_for_xlog_prune | 268435456
max_wal_senders         | 20
most_available_sync     | off
recovery_time_target    | 60
standby_shared_buffers_fraction| 1
tcp_keepalives_count    | 20
tcp_keepalives_idle     | 60
tcp_keepalives_interval | 30
use_workload_manager    | on
vacuum_cost_delay       | 1
vacuum_cost_limit       | 1000
wal_keep_segments       | 128
xloginsert_locks        | 16
work_mem                | '128MB'
__CN_END__


cat <<__DN_END__ > dn_guc.$$
advance_xlog_file_num   | 32
bulk_read_ring_size     | '2GB'
bulk_write_ring_size    | '2GB'
bypass_workload_manager | on
checkpoint_segments     | 128
effective_cache_size    | '20GB'
enable_codegen          | on
enable_orc_cache        | off
enable_stream_operator  | off
enable_wdr_snapshot     | on
instr_unique_sql_count  | 200000
local_syscache_threshold| '16MB'
maintenance_work_mem    | '256MB'
max_active_statements   | -1
max_connections         | 4000
max_coordinators        | 128
max_datanodes           | 256
max_files_per_process   | 1024
max_pool_size           | 8192
max_replication_slots   | 20
max_size_for_xlog_prune | 268435456
max_wal_senders         | 20
most_available_sync     | off
recovery_time_target    | 60
standby_shared_buffers_fraction| 1
tcp_keepalives_count    | 20
tcp_keepalives_idle     | 60
tcp_keepalives_interval | 30
use_workload_manager    | on
vacuum_cost_delay       | 1
vacuum_cost_limit       | 1000
wal_keep_segments       | 128
xloginsert_locks        | 16
work_mem                | '128MB'
__DN_END__

rm -f set_guc.$$
awk -F "|" 'BEGIN{O=""}/|/{gsub(/ /, "",$1); gsub(/ /, "",$2); O=O" -c \x22"$1"="$2"\x22"}END{print "gs_guc set -Z coordinator -I all -N all", O}' cn_guc.$$ >> set_guc.$$
awk -F "|" 'BEGIN{O=""}/|/{gsub(/ /, "",$1); gsub(/ /, "",$2); O=O" -c \x22"$1"="$2"\x22"}END{print "gs_guc set -Z datanode    -I all -N all", O}' dn_guc.$$ >> set_guc.$$

rm -f cn_guc.$$ dn_guc.$$

sh set_guc.$$
rm set_guc.$$

```

执行

```shell
sh /data/performance/general_guc.sh
```

**OLTP**

编辑并执行  /data/performance/oltp_guc.sh

```sh

# sort in alphabetic order!!!

gs_guc set -Z coordinator -I all -N all \
    -c "enable_dynamic_workload=off" \
    -c "enable_stream_operator=off" \
    -c "enable_thread_pool=off" \
    -c "max_prepared_transactions=2048" \
    -c "query_dop=1" \
    -c "recovery_time_target=0" \
    -c "shared_buffers='2GB'" \
    -c "thread_pool_attr='576,2,(nobind)'" \
    -c "update_lockwait_timeout=1200000"


gs_guc set -Z datanode -I all -N all \
    -c "enable_dynamic_workload=off" \
    -c "enable_stream_operator=off" \
    -c "enable_thread_pool=off" \
    -c "max_prepared_transactions=2048" \
    -c "query_dop=1" \
    -c "recovery_time_target=0" \
    -c "shared_buffers='32GB'" \
    -c "thread_pool_attr='576,2,(nobind)'" \
    -c "update_lockwait_timeout=1200000"

```

**注意：**

> 检查内存设置参数  max_process_memory ,shared_buffers:  登录数据库服务器使用`gsql`  元命令查看 ` show max_process_memory``show shared_buffers ` max_process_memory =  服务总内存/节点数量 shared_buffers  参数值调高可以提高查询性能，当前场景下建议值为   max_process_memory/2

执行数据库参数调整后需要重启数据库，进入数据库 CN 节点服务器执行如下命令：

```shell
cm_ctl stop
cm_ctl start
```

**数据初始化**

在环境配置好之后，我们就可以进行数据初始化工作了，这一步主要使用`BenchmarkSQL`  工具进行。

1. 登录负载服务器，编辑运行如下脚本：

```sh
mkdir -p /data/tpc-c/logs
nohup sh /data/tpc-c/benchmark/run/runDatabaseBuild.sh > /data/tpc-c/logs/load_data.log 2>&1 &
tail -f /data/tpc-c/logs/load_data.log
```

2. 观察日志，比如我们初始化 10 仓数据，日志输出  `Loading Warehouse 10 done`   说明数据初始化成功。 ![Pasted image 20240830141211.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/ddfef7f4-bb6c-48d2-9e14-674cd9958489.png)
3. 观察索引创建情况，出现下图时成功

![Pasted image 20240830141857.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/vBPlNYXRr2bVOdG8/img/2fca18ff-7042-4cce-9060-ab8e1c4a0a9d.png)

> 有一些外键创建失败，忽略该错误

4. 初始化后查看数据新

查询表结构是否正确（主键、索引） 查询表数据量和数据存储大小

5. 异常情况处理

数据初始化中的一些异常、错误请联系 DBA 进行处理。

清除数据命令：

```shell
sh runDatabaseDestroy.sh hexadb.properties
```

**性能监控**

**监控指标**

TPC-C  测试运行期间的性能监控分   服务器监控和数据库监控两部分，监控的指标项为：

| **序号** | **指标项**     | **类别**   | **采集周期** | **监控工具**  |
| -------- | -------------- | ---------- | ------------ | ------------- |
| 1        | CPU 使用率     | 服务器监控 | 10s          | nmon          |
| 2        | 内存使用及占比 | 服务器监控 | 10s          | nmon          |
| 3        | 磁盘 IO        | 服务器监控 | 10s          | nmon          |
| 4        | 网络 IO        | 服务器监控 | 10s          | nmon          |
| 5        | 节点内存使用   | 数据库监控 | 30s          | 司南 or  脚本 |
| 6        | QPS            | 数据库监控 | 30s          | 司南 or  脚本 |
| 7        | 响应时间       | 数据库监控 | 30s          | 司南 or  脚本 |
| 8        | 会话数         | 数据库监控 | 30s          | 司南 or  脚本 |
| 9        | 连接数         | 数据库监控 | 30s          | 司南 or  脚本 |
| 10       | TPS            | 数据库监控 | 30s          | 司南 or  脚本 |
| 11       | 事务响应时间   | 数据库监控 | 30s          | 司南 or  脚本 |
| 12       | 事务锁等待次数 | 数据库监控 | 30s          | 司南 or  脚本 |
| 13       | 事务数量       | 数据库监控 | 30s          | 司南 or  脚本 |
| 14       | P80            | 数据库监控 | 30s          | 司南 or  脚本 |
| 15       | p95            | 数据库监控 | 30s          | 司南 or  脚本 |

**监控工具**

### 有司南

使用司南进行数据库集群监控

### 无司南

使用 nmon  进行数据库服务器监控，要对所有数据库服务器进行 nmon  安装。 执行命令`nmon -fT -s 10 -c 720`  开启监控。该命令每 10 秒采集一次数据，采集 2 小时

数据库性能监控脚本暂无  ，待补充。

**执行测试**

正式开始测试前检查   测试配置，重点关注下

1. terminals :  并发量
2. runMins:  运行时间
3. 监控工具是否开启

使用如下命令开始 TPC-C 测试

```shell
cd /data/tpc-c/benchmark/run
./runBenchmark.sh props.hexadb > tpcc.log 2>&1 &
```

> 需要执行 3 次以上的 TPC-C  测试，获取数据库最稳定的性能表现

**测试报告**

测试报告参考  ：
