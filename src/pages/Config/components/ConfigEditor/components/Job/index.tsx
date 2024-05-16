import { Button, Form } from "@arco-design/web-react";
import styles from "./index.module.less";
import { useMemoizedFn } from "ahooks";
import { IconPlus } from "@arco-design/web-react/icon";
import JobExecutor from "./components/JobExecutor";
import { randomId } from "@/shared/randomId";
import { forwardRef, useImperativeHandle } from "react";
import { Job, SharedInstance } from "../../sharedType";

export interface JobConfigProps {
  initialValues: JobValue;
}

export type JobValue = {
  jobs: Job[];
};

export interface JobConfigInstance extends SharedInstance<JobValue> {}

/**
 *
 */
const JobConfig = forwardRef<JobConfigInstance, JobConfigProps>(
  (props, ref) => {
    const { initialValues } = props;
    const [form] = Form.useForm();
    const doAddJob = useMemoizedFn(() => {
      let jobs = form.getFieldValue("jobs");
      if (!jobs) {
        jobs = [];
      }
      const job = {
        name: undefined,
        id: randomId("job"),
        numOfThread: 1,
        pauseTime: 0,
        enable: true,
        refGlobals: [],
        taskletQueue: [],
      };
      jobs.push(job);
      form.setFieldValue("jobs", jobs);
    });

    const removeJob = useMemoizedFn((jobId: string) => {
      let jobs = form.getFieldValue("jobs");
      if (!jobs) {
        return;
      }
      jobs = jobs.filter((p) => p.id !== jobId);
      form.setFieldValue("jobs", jobs);
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues() {
            return form.validate();
          },
          getRawValues() {
            return form.getFieldsValue() as any;
          },
        };
      },
      [form]
    );

    return (
      <div className={styles.job}>
        <div className={styles.actionWrapper}>
          <Button onClick={doAddJob} type="outline" icon={<IconPlus />}>
            添加执行Job
          </Button>
        </div>
        <Form initialValues={initialValues} form={form}>
          <Form.List field="jobs">
            {(fields) => {
              return (
                <div className={styles.jobs}>
                  {fields.map((item) => {
                    return (
                      <JobExecutor
                        form={form}
                        parentField={item.field}
                        removeJob={removeJob}
                        key={item.key}
                      />
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Form>
      </div>
    );
  }
);

export default JobConfig;
