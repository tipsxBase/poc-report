# ListSearchLayout

一个带有 Grid 布局和可选的换行样式的表单组件。

## Props

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| submitButton | JSX.Element | - | 提交、重置按钮，由于是使用 flex 布局来改变的，所以需要传入两个子元素，或者两个子元素用 Fragment 标签包裹传入。 |
| children | React.ReactNode | - | 子元素，一般为 FormItem 的合集。 |
| cols | GridProps['cols'] | { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 } | 同 Grid 组件的 cols。 |
| colGap | GridProps['colGap'] | 12 | 同 Grid 组件的 colGap。 |

## 使用示例

```jsx
import ListSearchLayout from './ListSearchLayout';

<Form>
  <ListSearchLayout
    submitButton={
      <>
        <Button>提交</Button>
        <Button type="text">重置</Button>
      </>
    }
  >
    <FormItem label="名称" name="name">
      <Input />
    </FormItem>
    <FormItem label="类型" name="type">
      <Select options={options} />
    </FormItem>
    <FormItem label="状态" name="status">
      <Select options={options} />
    </FormItem>
    <FormItem label="时间" name="time">
      <RangePicker />
    </FormItem>
  </ListSearchLayout>
</Form>
```
注意

ListSearchLayout组件依赖于@arco-design/web-react组件库，如果在项目中使用该组件，需要先安装@arco-design/web-react。