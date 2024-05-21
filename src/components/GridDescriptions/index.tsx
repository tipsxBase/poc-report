import { CSSProperties, ReactNode, useMemo } from "react";
import styles from "./index.module.less";
import { ColProps, Divider, Grid } from "@arco-design/web-react";
import classNames from "classnames";
export interface DataType {
  label: ReactNode;
  key: string;
  value: ReactNode;
  span?: number;
  layout?: Pick<ColProps, "xl" | "xs" | "xxl" | "xxxl">;
  labelStyle?: CSSProperties;
  valueStyle?: CSSProperties;
  featureKey?: string;
}

const { Row, Col } = Grid;

export interface GridDescriptionsProps {
  data: DataType[];
  labelWidth?: number | string;
  valueWidth?: number | string;
  gutter?: number;

  title?: ReactNode;
  /**
   * 显示分隔线
   */
  showDivider?: boolean;
  className?: string;
}

const GridDescriptions = (props: GridDescriptionsProps) => {
  const {
    data,
    labelWidth,
    valueWidth,
    gutter,
    title,
    showDivider,
    className,
  } = props;

  const gridData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter(Boolean);
  }, [data]);

  const labelStyle = useMemo(() => {
    if (labelWidth === null || labelWidth === undefined) {
      return null;
    }
    return {
      flex: `0 0 ${
        typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth
      }`,
    };
  }, [labelWidth]);

  const valueStyle = useMemo(() => {
    if (valueWidth === null || valueWidth === undefined) {
      return null;
    }
    return {
      flex: `0 0 ${
        typeof valueWidth === "number" ? `${valueWidth}px` : valueWidth
      }`,
    };
  }, [valueWidth]);

  const gutterStyle = useMemo(() => {
    let innerPadding = 0;
    if (gutter === null || gutter === undefined) {
      innerPadding = 12;
    } else {
      innerPadding = gutter / 2;
    }
    return {
      rowStyle: {
        marginLeft: -innerPadding,
        marginRight: -innerPadding,
      } as CSSProperties,
      colStyle: {
        paddingLeft: innerPadding,
        paddingRight: innerPadding,
      } as CSSProperties,
    };
  }, [gutter]);

  return (
    <div className={classNames(className, styles.gridDescriptions)}>
      {title ? <div className={styles.gridTitle}>{title}</div> : null}
      <Row gutter={gutter || 24}>
        {gridData.map((item) => {
          if (item.featureKey) {
            return (
              <Col
                key={item.key}
                span={item.span || 24}
                {...item.layout}
                style={gutterStyle.rowStyle}
                className={classNames(
                  "grid-description",
                  styles.gridDescription
                )}
              >
                <div
                  style={{
                    ...labelStyle,
                    ...gutterStyle.colStyle,
                    ...item.labelStyle,
                  }}
                  className={styles.label}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    ...valueStyle,
                    ...gutterStyle.colStyle,
                    ...item.valueStyle,
                  }}
                  className={styles.value}
                >
                  {item.value}
                </div>
              </Col>
            );
          }
          return (
            <Col
              key={item.key}
              span={item.span || 24}
              {...item.layout}
              style={gutterStyle.rowStyle}
              className={classNames("grid-description", styles.gridDescription)}
            >
              <div
                style={{
                  ...labelStyle,
                  ...gutterStyle.colStyle,
                  ...item.labelStyle,
                }}
                className={styles.label}
              >
                {item.label}
              </div>
              <div
                style={{
                  ...valueStyle,
                  ...gutterStyle.colStyle,
                  ...item.valueStyle,
                }}
                className={styles.value}
              >
                {item.value}
              </div>
            </Col>
          );
        })}
      </Row>
      {showDivider && (
        <Divider
          type="horizontal"
          className={classNames("grid-descriptions-divider", styles.divider)}
        />
      )}
    </div>
  );
};

export default GridDescriptions;
