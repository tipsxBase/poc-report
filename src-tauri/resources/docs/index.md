---
"title": "POC 最佳实践"
---

# POC 最佳实践

## POC  测试流程

![/Users/zhaowencong/Desktop/POC流程图-第 2 页.drawio.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1GXn4BW12zvDODQ4/img/f300d867-0176-4b42-b620-dd0d85d30723.png)

## 从零开始做 POC

### 先对目标服务器进行磁盘性能测试及网络带宽测试，此步骤也可在数据库安装完成后让运维同学进行测试

```shell
fio --directory=/data/test --direct=1 --iodepth=32 --ioengine=libaio --bs=8k --size=4G --rw=randread --name=iops

fio --directory=/data/test --direct=1 --iodepth=32 --ioengine=libaio --bs=8k --size=4G --rw=randwrite --name=iops

fio --directory=/data/test --direct=1 --iodepth=32 --ioengine=libaio --bs=8k --size=4G --rw=write --name=iops
```

```shell
iperf3 -c 172.16.0.3 -b 1000M  -t  3  -d
```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1GXn4BW12zvDODQ4/img/536f9f16-36b3-4bff-8136-e4ab7b1f0366.png)

**注：如果客户没有提供测试的服务或客户提供的测试服务器磁盘性能或网络性能测试效果不佳，可以引导客户使用我们的服务器进行测试，这样测试过程跟测试结果更加可控**。

### 参数调整

在我们的知识库：[海纳参数调整](https://alidocs.dingtalk.com/i/nodes/gpG2NdyVXgxxOn3ZCXq63ekYWMwvDqPk?utm_scene=team_space)中有对应的调整参数的脚本：

- [请至钉钉文档查看附件《general_guc.sh》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02lzw3ert2ofqo5952fi)是通用的参数调整脚本
- [请至钉钉文档查看附件《oltp_guc.sh》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02lzw3h4mzi0oxzf8wnr8)是  TP  场景的参数调整脚本
- [请至钉钉文档查看附件《olap_guc.sh》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02lzw3hwjf9bas7cxikct)是  AP  场景下的参数调整脚本

如果测试的是  TP  场景，那么就将  general_guc.sh  跟  oltp_guc.sh  脚本执行一下，如果是  AP  场景就将 general_guc.sh  跟  olap_guc.sh  脚本执行一下。

```xml
sh general_guc.sh
sh oltp_guc.sh
```

```xml
sh general_guc.sh
sh olap_guc.sh
```

### 准备测试用例 yaml 文件

根据客户的测试需求，从 POC 测试资产选择合适的测试用例，并按照测试要求将并发数、行宽及数据量进行调整。可以使用我们的工具进行测试用例管理

[请至钉钉文档查看附件《POCMaster_0.2.2_aarch64.dmg》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02lzw3mwy81o9lyno8wvg)[请至钉钉文档查看附件《POCMaster_0.2.2_x64_en-US.msi》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02lzw3mwy81o9lyno8wvg)[请至钉钉文档查看附件《POC 测试资产.docx》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02lzw3mwy81o9lyno8wvg)

**注：**

1.  **如果资产库已有的用例已经有测试结果并且已经满足客户的测试需求的，大家可以跳过实际测试，直接拿测试结果。**
2.  **如果客户没有特别具体的测试需求，那么我们可以按照客户的业务场景，比如  TP  还是  AP，然后从 POC 测试资产中选择适量用例形成测试报告。**

### 创建需要测试数据表

1.  连接数据库

```postgresql
$ gsql -r -p 26700 -d postgres
```

2.  创建用户，poc 测试时推荐创建用户时指标  sysadmin  角色，后面可以省去不少表没有权限的情况

```postgresql
hexadb=# create user poc_train_row sysadmin password 'hexadb@2024';
```

3.  创建库

```postgresql
hexadb=# CREATE DATABASE poc owner poc_admin_row ENCODING 'UTF8' dbcompatibility = 'PG';
```

4.  使用新建的用户连接数据库

```postgresql
$ gsql -d poc -U poc_admin_row -W poc@20240408 -p 26700 -r
```

5.  创建 schema，推荐 schema  的名称跟用户名一样，这样在使用 jdbc 连接数据库的时候就可以不用指定  schema  名称，可以很容易的实现不同的用户连接不同的 schema。

```postgresql
  poc=> create schema poc_admin_row;
```

6.  执行 DDL

DDL 区分是  AP  还是  TP？

TP  场景则选择[请至钉钉文档查看附件《ddl-row_oltp.sql》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02m00qy57lk6fghf614n)

AP  场景选择[请至钉钉文档查看附件《ddl-column_olap.sql》](https://alidocs.dingtalk.com/i/nodes/NkDwLng8ZePP3RLmsmqAZ4PrJKMEvZBY?doc_type=wiki_doc&iframeQuery=anchorId%3DX02m00qyvxi7tyn8dp05xh)

将 DDL 语句先上传至服务器中，通过命令创建数据表，也可以使用客户端工具比如  Navicat  或  DBeaver  等工具进行创建

```postgresql
# 连接数据库
$ gsql -d poc -U poc_admin_row -W poc@20240408 -p 26700 -r

# 执行DDL语句
\i /home/omm/poc/ddl.sql;
```

### 执行测试

将测试用例及测试工具上传至测试服务器，启动测试工具进行测试

注：我们的测试工具依赖于 Java17，测试工具包中包括 JDK17 及测试工具包

```plaintext
./jdk-17.0.10/bin/java -jar hexadb-poc.jar -config ./poc-cases/prepare_train.yml
```

```plaintext
nohup ./jdk-17.0.10/bin/java -jar hexadb-poc.jar -config ./poc-cases/514_train.yml > run.log 2>&1 &
```

### 生成形成报告

按照我们提供的[测试报告模板](https://alidocs.dingtalk.com/i/nodes/mweZ92PV6zLLZ7M6C7j1MMyyVxEKBD6p?utm_scene=team_space)，收集测试用例的执行结果生成测试报告

## POC  工具

### 2.1  流行流程图

![POC流程图.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1GXn4BW12zvDODQ4/img/a6ab405c-00a5-4d03-8cb6-e18dcd711c89.png)

## 数据库常用命令

### 2.1  命令行相关

#### 2.1.1  查询集群状态

```shell
$ cm_ctl query -Cvipd
```

```plaintext
[ CMServer State   ]
node               node_ip         instance                                             state
------------------------------------------------------------------------------------------------
1 hexadb-master01 172.16.0.2     1   /data/hexadb_distributed/data/cmserver/cm_server Primary
2 hexadb-master02 172.16.0.3     2   /data/hexadb_distributed/data/cmserver/cm_server Standby
[   Cluster State   ]
cluster_state   : Normal
redistributing : No
balanced       : No
current_az     : AZ_ALL
[ Coordinator State ]
node               node_ip         instance                                             state
-----------------------------------------------------------------------------------------
1 hexadb-master01 172.16.0.2     5001 26700 /data/hexadb_distributed/data/coordinator Normal
2 hexadb-master02 172.16.0.3     5002 26700 /data/hexadb_distributed/data/coordinator Normal
[ Central Coordinator State ]
node               node_ip         instance                                       state
-----------------------------------------------------------------------------------------
2 hexadb-master02 172.16.0.3     5002 /data/hexadb_distributed/data/coordinator Normal
[     GTM State     ]
node               node_ip         instance                               state                   sync_state
-----------------------------------------------------------------------------------------------------------------
2 hexadb-master02 172.16.0.3     1001 /data/hexadb_distributed/data/gtm P Standby Connection ok Sync
3 hexadb-master03 172.16.0.4     1002 /data/hexadb_distributed/data/gtm S Primary Connection ok Sync
[ Datanode State   ]
node               node_ip         instance                                         state           | node               node_ip         instance                                         state           | node               node_ip         instance                                         state
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1 hexadb-master01 172.16.0.2     6001 40001 /data/hexadb_distributed/data/master1 P Primary Normal | 2 hexadb-master02 172.16.0.3     6002 40001 /data/hexadb_distributed/data/slave1 S Standby Normal | 3 hexadb-master03 172.16.0.4     3002 /data/hexadb_distributed/data/dummy1 R Secondary Normal
2 hexadb-master02 172.16.0.3     6003 40201 /data/hexadb_distributed/data/master2 P Standby Normal | 3 hexadb-master03 172.16.0.4     6004 40201 /data/hexadb_distributed/data/slave2 S Primary Normal | 1 hexadb-master01 172.16.0.2     3003 /data/hexadb_distributed/data/dummy2 R Secondary Normal
3 hexadb-master03 172.16.0.4     6005 40401 /data/hexadb_distributed/data/master3 P Primary Normal | 1 hexadb-master01 172.16.0.2     6006 40401 /data/hexadb_distributed/data/slave3 S Standby Normal | 2 hexadb-master02 172.16.0.3     3004 /data/hexadb_distributed/data/dummy3 R Secondary Normal
```

#### 2.1.2  重启集群

```shell
$ cm_ctl stop; cm_ctl start
```

#### 2.1.3  使用  gs_guc  修改数据库参数

```shell
$ gs_guc set -I all -N all -c "advance_xlog_file_num=16" -c "enable_thread_pool=off" -Z datanode -Z coordinator
```

> \-N node

> \-I instance

> \-c  具体要设置的参数值

> 设置指定 node 指定 instance 的参数

```shell
# 设置 hexadb-master01 节点上 dn_6001_6002 的参数
$ gs_guc set -N hexadb-master01 -I dn_6001_6002 -c "cstore_buffers=2GB" -Z datanode
```

有的参数修改完是不需要重启集群的，有的参数修改完是需要重启集群的，参考  [openGauss 官网](https://docs-opengauss.osinfra.cn/zh/docs/2.1.0/docs/Developerguide/GUC%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E.html)。

### 2.2  数据库脚本

#### 2.2.1  查询列存表的相关信息

列存表需要注意 cu 的信息，cu 太小的话会严重影响查询性能，查询 cu(文件单元的相关信息)，需要连接 DN 上执行

```postgresql
-- 没有分区的表
-- 查询oid
select oid, * from pg_class where relname = 'table_name';
-- 查询 cu信息
select * from cstore.pg_cudesc_63893177 -- 63893177是oid的值;
-- 带分区的表
select oid, * from pg_class where relname = 'poc_product';
select * from pg_partition where parentid = 63890951; -- 63890951是oid的值;
select * from cstore.pg_cudesc_part_63890955; -- 63890955是relfilenode对应的列
```

#### 2.2.2  其它数据库常用脚本

```postgresql
-- 查看当前schema
show current_schmea;
-- 修改schema
set current_schema to new_schema;
-- 查看所有schema
\dn
-- 执行sql 脚本
\i /home/omm/ddl.sql;
-- 查看所有数据表
\d+
-- 查看指定的数据表
\d+ table_name
-- 查看最大连接数
SELECT setting FROM pg_settings WHERE name = 'max_connections';
-- 查询数据库指定参数的配置
show max_connections;
-- 获取当前活跃连接数
SELECT count(*) FROM pg_stat_activity;
-- 查询当前正在执行的SQL
select query  from pg_stat_activity where state = 'active';
-- 查询数据的大致数据量
analyze t_sim_cdr_apn_usage_p;
select relname, reltuples from pg_class where relname like 'table_name%';
-- 停止当前正在执行的SQL
SELECT 
pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid() -- 排除当前会话
AND state = 'active' -- 只选择活动的会话
AND query ILIKE '%YOUR_QUERY%';

select pg_terminate_backend(pid) from pg_stat_activity where pid <> pg_backend_pid() and state = 'active' and query ilike 'SELECT b.brand_name%';
```

## 数据库参数设置及优化

### 3.1  列式存储开启 delta 表

列存表写入时建议开启 delta 表，如果不开启 delta 表直接写入列存表，会导致列存数据单元太小，这样不仅仅是磁盘性能占用很大，而且影响查询性能，开启 delta 后，会先将数据写入 delta 行存表，然后再自动存入列存表。

```shell
$ gs_guc reload -N all -I all -c "enable_delta_store=on" -Z coordinator -Z datanode
```

### 3.2  全文倒排索引( GIN-> Generalized Inverted Index )

创建 vs 插入

由于可能要为每个项目插入很多键，所以 GIN 索引的插入可能比较慢。对于向表中大量插入的操作，我们建议先删除 GIN 索引，在完成插入之后再重建索引。与 GIN 索引创建、查询性能相关的 GUC 参数如下：

- maintenance_work_mem

GIN 索引的构建时间对 maintenance_work_mem 的设置非常敏感。

- work_mem

在向启用了 FASTUPDATE 的 GIN 索引执行插入操作的期间，只要待处理实体列表的大小超过了 work_mem，系统就会清理这个列表。为了避免可观察到的响应时间的大起大落，让待处理实体列表在后台被清理是比较合适的（比如通过 autovacuum）。前端清理操作可以通过增加 work_mem 或者执行 autovacuum 来避免。然而，扩大 work_mem 意味着如果发生了前端清理，那么他的执行时间将更长。

- gin_fuzzy_search_limit

开发 GIN 索引的主要目的是为了让 openGauss 支持高度可伸缩的全文索引，并且常常会遇见全文索引返回海量结果的情形。而且，这经常发生在查询高频词的时候，因而这样的结果集没什么用处。因为从磁盘读取大量记录并对其进行排序会消耗大量资源，这在产品环境下是不能接受的。为了控制这种情况，GIN 索引有一个可配置的返回结果行数的软上限的配置参数 gin_fuzzy_search_limit。缺省值 0 表示没有限制。如果设置了非零值，那么返回结果就是从完整结果集中随机选择的一部分。“软上限”的意思是返回结果的实际数量可能与指定的限制有偏差，这取决于查询和系统随机数生成器的质量。

### 3.3  复制表

不经常变化但需要经常关联小表（比如字典表）创建为复制表，复制表会在在各个 DN 上都存在，搜索时可以减少跨 DN 查找数据。

### 3.4  数据库优化的参数

#### 3.4.1 work_mem

设置内部排序操作和 Hash 表在开始写入临时磁盘文件之前使用的内存大小。ORDER BY、DISTINCT 和 merge joins 都要用到排序操作。Hash 表在散列连接、散列为基础的聚集、散列为基础的 IN 子查询处理中都要用到。

对于复杂的查询，可能会同时并发运行好几个排序或者散列操作，每个都可以使用此参数所声明的内存量，不足时会使用临时文件。同样，好几个正在运行的会话可能会同时进行排序操作。因此使用的总内存可能是 work_mem 的好几倍。

**设置命令：**

```postgresql
gs_guc set -N all -I all -c "work_mem=1GB" -Z coordinator -Z datanode 
```

**设置建议：**

依据查询特点和并发来确定，一旦 work_mem 限定的物理内存不够，算子运算数据将写入临时表空间，带来 5-10 倍的性能下降，查询响应时间从秒级下降到分钟级。

- 对于串行无并发的复杂查询场景，平均每个查询有 5-10 关联操作，建议 work_mem=50%内存/10。
- 对于串行无并发的简单查询场景，平均每个查询有 2-5 个关联操作，建议 work_mem=50%内存/5。
- 对于并发场景，建议 work_mem=串行下的 work_mem/物理并发数

#### 3.4.2 max_process_memory

设置一个数据库节点可用的最大物理内存。

**设置命令：**

```postgresql
gs_guc set -N all -I all -c "max_process_memory=4GB" -Z datanode -Z coordinator
```

**设置建议：**

数据库节点上该数值需要根据系统物理内存及单节点部署主数据库节点个数决定。建议计算公式如下：(物理内存大小  - vm.min_free_kbytes) \\\* 0.7 / (1 +  主节点个数)。该系数的目的是尽可能保证系统的可靠性，不会因数据库内存膨胀导致节点 OOM。这个公式中提到 vm.min_free_kbytes，其含义是预留操作系统内存供内核使用，通常用作操作系统内核中通信收发内存分配，至少为 5%内存。即，max_process_memory =  物理内存  \* 0.665 / (1 +  主节点个数)。

2C3D  对应 CN 主节点个数为 2，DN 主节点个数为 3

> **注意：**  当该值设置不合理，即大于服务器物理内存，可能导致操作系统 OOM 问题。

#### 3.4.3 shared_buffers

设置 HexaDB 使用的共享内存大小。增加此参数的值会使 HexaDB 比系统默认设置需要更多的 System V 共享内存。

**设置命令**

```postgresql
gs_guc set -N all -I all -c "shared_buffers=2GB" -Z coordinator -Z datanode
```

**设置建议：**

建议设置 shared_buffers 值为内存的 40%以内。行存列存分开对待。行存设大，列存设小。列存：(单服务器内存/单服务器数据库节点个数)\*0.4\*0.25。

如果设置较大的 shared_buffers 需要同时增加 checkpoint_segments 的值，因为写入大量新增、修改数据需要消耗更多的时间周期。

#### 3.4.4 max_connections

允许和数据库连接的最大并发连接数。此参数会影响 HexaDB 的并发能力。

**设置命令**

```postgresql
gs_guc set -N all -I all -c "max_connections=300" -Z datanode -Z coordinator
```

**设置建议：**

当高并发时提示数据库连接不够时，通过调整 max_connections 增加数据库连接

#### 3.4.5 cstore_buffers

设置列存所使用的共享缓冲区的大小。

**设置命令**

```postgresql
gs_guc set -N all -I all -c "cstore_buffers=2GB" -Z datanode
```

**设置建议：**

列存表使用 cstore_buffers 设置的共享缓冲区，几乎不用 shared_buffers。因此在列存表为主的场景中，应减少 shared_buffers，增加 cstore_buffers。

## FAQ

### 4.1  当列存表开启 delta（3.1）通过 2.2.1 查询发现数据还在 delta 表，没有真正写入列存表时，要怎么办？

可以手动从 delta 表 merge 到列存表

```postgresql
vacuum deltamerge poc_product;
```

### 4.2  如果通过  cm_ctl  查询集群状态特别慢，需要怎么办？

可以尝试杀掉  cm_server  进程

```shell
$ ps -ux | grep cm_server
$ kill -9 id
```

## 其它命令

### 查询磁盘、IO、网络等适时指标

```shell
# 每3秒打印一次
sar -n DEV -urd 3
```

### 查询磁盘使用情况

```shell
df -h
```

### 海纳日志目录

```shell
su - omm
cd $GAUSSLOG/pg_log
```
