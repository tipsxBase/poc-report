import yaml from "js-yaml";
import { randomId } from "./randomId";

class CustomTag {
  klass: any;
  constructor(type, data) {
    this.klass = type.slice(1);
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

const tag = new yaml.Type("!", {
  kind: "mapping",
  multi: true,
  representName: function (object) {
    return object.type;
  },
  represent: function (object) {
    return object.data;
  },
  instanceOf: CustomTag,
  construct: function (data, type) {
    return new CustomTag(type, data);
  },
});

const CUSTOM_SCHEMA = yaml.DEFAULT_SCHEMA.extend([tag]);

export const parseYmlToJson = (yml: string) => {
  const json = JSON.parse(
    JSON.stringify(yaml.load(yml, { schema: CUSTOM_SCHEMA }))
  );
  return formatJson(json);
};

export const parseJsonToYml = (json: object) => {
  const yml = yaml.dump(json);
  return yml.replace(/klass:\s/g, "!");
};

const formatJson = (json: any) => {
  const { globalPreProcessors, jobs, writeLogCronExpression } = json;
  if (globalPreProcessors) {
    json["globalPreProcessors"] = globalPreProcessors.map((p) => {
      if (!p.id) {
        p.id = randomId("g");
      }
      return p;
    });
  }

  if (jobs) {
    json["jobs"] = jobs.map((j) => {
      if (!j.id) {
        j.id = randomId("job");
      }
      const { taskletQueue } = j;
      if (taskletQueue) {
        j.taskletQueue = taskletQueue.map((t) => {
          if (!t.id) {
            t.id = randomId("task");
          }
          return t;
        });
      }

      return j;
    });
  }

  if (!writeLogCronExpression) {
    json.writeLogCronExpression = "0/30 * * * * ?";
  }

  return json;
};
