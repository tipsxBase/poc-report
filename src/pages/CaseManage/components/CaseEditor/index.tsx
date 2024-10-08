import { Form, Input, Steps, Grid } from "@arco-design/web-react";
import styles from "./index.module.less";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMemoizedFn } from "ahooks";
import ConfigEditor, { ConfigEditorInstance } from "./ConfigEditor";
import CategorySelect from "@/components/CategorySelect";
import { CaseEntity } from "@/service/case";
import Scrollbars from "react-custom-scrollbars-2";
import useCategoryStore from "@/stores/category";

export interface CaseEditorProps {
  action: "add" | "update" | "copy" | "uploadCase";
  rawEntity: CaseEntity;
}

const Row = Grid.Row;

const Col = Grid.Col;

const Step = Steps.Step;

export interface CaseEditorInstance {
  getValues: () => Promise<any>;
}

const createInitialCase = () => {
  return {
    writeLogCronExpression: "0/30 * * * * ?",
  };
};

/**
 * 配置
 */
const CaseEditor = forwardRef<CaseEditorInstance, CaseEditorProps>(
  (props, ref) => {
    const { action, rawEntity } = props;
    const { queryRefServer } = useCategoryStore();
    const [jdbcUrl, setJdbcUrl] = useState<string>("jdbc:hexadb://");
    const { formInitialValues, initialCaseConfig } = useMemo(() => {
      if (!rawEntity || !action) {
        return {
          formInitialValues: null,
          initialCaseConfig: null,
        };
      }
      if (action === "add") {
        return {
          formInitialValues: null,
          initialCaseConfig: createInitialCase(),
        };
      }
      if (action === "update" || action === "copy") {
        const { case_name, case_content, category_id, case_description } =
          rawEntity;
        let config = null;
        try {
          config = JSON.parse(JSON.parse(case_content));
        } catch (error) {
          config = createInitialCase();
        }

        const formInitialValues: any = {
          case_name,
          case_description,
        };

        if (action === "update") {
          formInitialValues.category_id = category_id;
        }

        return {
          formInitialValues: formInitialValues,
          initialCaseConfig: config,
        };
      }

      if (action === "uploadCase") {
        const { case_content, case_name } = rawEntity;
        return {
          formInitialValues: { case_name },
          initialCaseConfig: case_content,
        };
      }
    }, [rawEntity, action]);

    const [step, setStep] = useState(1);
    const [form] = Form.useForm();

    const configEditorInstance = useRef<ConfigEditorInstance>();

    const toPrev = useMemoizedFn(() => {
      if (step === 1) {
        return;
      }
      setStep(step - 1);
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          getValues: () => {
            return Promise.all([
              form.validate(),
              configEditorInstance.current.getValues(),
            ]).then(([values, case_content]) => {
              return {
                ...values,
                case_content: case_content,
              };
            });
          },
        };
      },
      [form]
    );

    const toNext = useMemoizedFn(() => {
      if (step === 7) {
        return;
      }
      if (step === 1) {
        form.validate().then(() => {
          setStep(step + 1);
        });
      } else {
        setStep(step + 1);
      }
    });

    const onCategorySelect = useMemoizedFn((category_id: number) => {
      queryRefServer(category_id).then((res) => {
        const { data } = res;
        const { cn_url } = data;
        setJdbcUrl(`jdbc:hexadb://${cn_url}`);
      });
    });

    return (
      <div className={styles.caseEditor}>
        <div className={styles.formWrapper}>
          <Form
            initialValues={formInitialValues}
            form={form}
            layout="horizontal"
          >
            <Row>
              <Col xxl={12} xs={24} xxxl={12} md={12}>
                <Form.Item
                  field="case_name"
                  rules={[{ required: true, message: "请输入用例名称" }]}
                  label="用例名称"
                >
                  <Input placeholder="请输入用例名称" />
                </Form.Item>
              </Col>
              <Col xxl={12} xs={24} xxxl={12} md={12}>
                <Form.Item
                  field="category_id"
                  rules={[{ required: true, message: "请选择项目名称" }]}
                  label="项目名称"
                >
                  <CategorySelect onChange={onCategorySelect} />
                </Form.Item>
              </Col>
              <Col xxl={24} xs={24} xxxl={24} md={24}>
                <Form.Item field="case_description" label="用例描述">
                  <Input.TextArea placeholder="请输入描述" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.editorWrapper}>
          <div className={styles.steps}>
            <Scrollbars>
              <div className={styles.stepScrollWrapper}>
                <Steps direction="vertical" type="dot" current={step}>
                  <Step
                    title="配置全局预处理器"
                    description="全局预处理器负责提前执行查询SQL，返回结果可以在执行单元中使用"
                  />
                  <Step
                    title="配置Job"
                    description="每个Job可以包括多个执行单元，不同Job是按序执行的"
                  />
                  <Step
                    title="配置监听器"
                    description="监听器负责监听整个过程中的一些指标"
                  />
                  <Step
                    title="配置数据源"
                    description="配置POC过程中的数据库连接信息"
                  />
                  <Step
                    title="基本信息配置"
                    description="配置POC过程中的数据库连接信息"
                  />
                  <Step
                    title="结果查看"
                    description="配置POC过程中的数据库连接信息"
                  />
                </Steps>
              </div>
            </Scrollbars>
          </div>
          <ConfigEditor
            initialCaseConfig={initialCaseConfig}
            ref={configEditorInstance}
            jdbcUrl={jdbcUrl}
            step={step}
            toPrev={toPrev}
            toNext={toNext}
          />
        </div>
      </div>
    );
  }
);

export default CaseEditor;
