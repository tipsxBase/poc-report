import TextRender from "@/components/TextRender";

export interface SummaryCardProps {
  label: string;
  value: string;
}

/**
 *
 */
const SummaryCard = (props: SummaryCardProps) => {
  const { label, value } = props;
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">
            <TextRender text={label} />
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">
            <TextRender className="text-2xl font-bold" text={value} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
