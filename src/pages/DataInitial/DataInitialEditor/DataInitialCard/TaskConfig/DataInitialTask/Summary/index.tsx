import SummaryCard from "./SummaryCard";

export interface SummaryProps {
  fields: { label: string; value: string }[];
}

/**
 *
 */
const Summary = (props: SummaryProps) => {
  const { fields } = props;

  return (
    <div className="grid grid-cols-2 gap-4 ">
      {fields.map(({ label, value }) => (
        <SummaryCard key={label} label={label} value={value} />
      ))}
    </div>
  );
};

export default Summary;
