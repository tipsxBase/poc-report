export interface SharedInstance<T extends Record<string, any>> {
  getValues: () => Promise<T>;
  getRawValues: () => T;
}

export enum ResultDataType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  INTEGER = "INTEGER",
  LONG = "LONG",
  FLOAT = "FLOAT",
  DOUBLE = "DOUBLE",
  BIG_DECIMAL = "BIG_DECIMAL",
  DATE = "DATE",
}

export enum MockRuleType {
  "title" = "中文标题",
  "sentence" = "中文句子",
  "decimalBetween" = "两个数之间的BigDecimal",
  "doubleBetween" = "两个数之间的浮点数",
  "snowflake" = "雪花ID",
  "dateBetween" = "日期",
  "integerBetween" = "两个数之间的整数(Integer)",
  "country" = "中文国家",
  "province" = "中文省份",
  "city" = "中文城市",
  "county" = "中文区县",
  "fullAddress" = "中文全地址",
  "fakerExpression" = "Faker表达式",
  "avatar" = "头像URL",
  "faker" = "Faker方法",
  "path" = "英文路径",
  "password" = "密码",
  "ipV4" = "IpV4",
  "ipV6" = "IpV6",
  "url" = "URL",
  "email" = "邮箱",
  "cellPhone" = "手机号",
  "phoneNumber" = "电话号码",
  "birthday" = "生日",
  "longBetween" = "两个数之间的整数(Long)",
  "gender" = "性别",
  "randomLong" = "随机整数(Long)",
  "zipCode" = "中文邮编",
  "port" = "端口",
  "randomString" = "字符串",
  "json" = "JSON",
  "global" = "引用全局",
  "enums" = "枚举",
}

export enum ProcessorType {
  PocMultiSqlExecuteProcessor = "批量插入执行器",
  PocSqlQueryExecuteProcessor = "查询执行器",
  PocCopyInsertProcessor = "Copy插入执行器",
}

export const isNumberType = (type: string) => {
  return (
    type === "global" ||
    [
      "decimalBetween",
      "doubleBetween",
      "snowflake",
      "integerBetween",
      "longBetween",
      "gender",
      "randomLong",
      "port",
      "enums",
    ].includes(type)
  );
};

export const isStringType = (type: string) => {
  return (
    type === "global" ||
    [
      "title",
      "sentence",
      "zipCode",
      "country",
      "province",
      "city",
      "county",
      "fullAddress",
      "fakerExpression",
      "avatar",
      "faker",
      "path",
      "password",
      "ipV4",
      "ipV6",
      "url",
      "email",
      "cellPhone",
      "phoneNumber",
      "randomString",
      "enums",
    ].includes(type)
  );
};

export const isDateType = (type: string) => {
  return type === "global" || ["dateBetween", "birthday"].includes(type);
};

export const isJsonType = (type: string) => {
  return type === "global" || ["json"].includes(type);
};

export const getValidateTypeFn = (type: string) => {
  switch (type) {
    case "string":
      return isStringType;
    case "number":
      return isNumberType;
    case "date":
      return isDateType;
    case "json":
      return isJsonType;
    default: {
      return () => false;
    }
  }
};

export enum SQLDataType {
  string = "字符串",
  number = "数字",
  date = "日期",
  json = "JSON",
}

export interface ResultDataDefine {
  klass: string;
  name: string;
  type: ResultDataType;
}

export interface GlobalPreProcessor {
  name: string;
  id: string;
  klass: string;
  sql: string;
  dataDefineList: ResultDataDefine[];
}

export interface MockDataDefine {
  key: string;
  type: SQLDataType;
  mockRule: MockRuleType;
  min?: number;
  max?: number;
  ref?: string;
  fakerExpression?: string;
  scale?: number;
  path?: string;
  nullPercent: number;
  klass: string;
}

export const needMinAndMax = (type: string) => {
  return [
    "title",
    "sentence",
    "doubleBetween",
    "integerBetween",
    "longBetween",
    "decimalBetween",
    "dateBetween",
    "randomString",
  ].includes(type);
};

export const needScale = (type: string) => {
  return ["decimalBetween"].includes(type);
};

export const needFakerExpression = (type: string) => {
  return ["fakerExpression"].includes(type);
};

export const needFakerPath = (type: string) => {
  return ["faker"].includes(type);
};

export const needGlobalRef = (type: string) => {
  return ["global", "snowflake"].includes(type);
};

export const needEnum = (type: string) => {
  return ["enums"].includes(type);
};

export const isSnowflake = (type: string) => {
  return ["snowflake"].includes(type);
};

export const needMeta = (type: string) => {
  return ["json"].includes(type);
};

export interface MockRule {
  batch: number;
  dataDefineList: MockDataDefine[];
}

export interface TaskletProcessor {
  klzss: string;
  name: string;
  transactionDelayTime: number;
  sql?: string;
  sqlCollection?: string[];
}

export interface Tasklet {
  id: string;
  name: string;
  loopCount: number;
  numOfThread: number;
  mockDataLine: MockRule;
  processors: TaskletProcessor[];
}

export interface Job {
  name: string;
  numOfThread: number;
  pauseTime: number;
  enable: boolean;
  refGlobals: string[];
  taskletQueue: Tasklet[];
}

export enum ListenerType {
  NodeMetricListener = "SAR指标监控",
  DbActiveConnectionListener = "活跃连接数监控",
}

export interface Listener {
  klass: ListenerType;
  name: string;
  cronExpression: string;
}

export interface DataSource {
  jdbcUrl: string;
  username: string;
  password: string;
}

export interface Basic {
  logPath: string;
}
