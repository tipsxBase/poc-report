import { CaseEntity } from "@/service/case";
import ConfigPreview from "../CaseEditor/ConfigEditor/components/ConfigPreview";
import styles from "./index.module.less";
import GridDescriptions, { DataType } from "@/components/GridDescriptions";

export interface CasePreviewerProps {
  config: CaseEntity;
}

/**
 *
 */
const CasePreviewer = (props: CasePreviewerProps) => {
  const { config } = props;

  const { case_name, category_name, case_content } = config;

  const initialValues = JSON.parse(JSON.parse(case_content));

  const data: DataType[] = [
    {
      key: "case_name",
      label: "用例名称",
      value: case_name,
      span: 12,
    },
    {
      key: "category_name",
      label: "项目名称",
      value: category_name,
      span: 12,
    },
  ];

  return (
    <div className={styles.casePreviewer}>
      <GridDescriptions showDivider data={data} />
      <ConfigPreview initialValues={initialValues} />
    </div>
  );
};

export default CasePreviewer;
