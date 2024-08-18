interface Props {
  id: string;
}
import { PieChart } from "@mui/x-charts/PieChart";

function DataAnalytics({ id }: Props) {
  return (
    <div>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "series A" },
              { id: 1, value: 15, label: "series B" },
              { id: 2, value: 20, label: "series C" },
            ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 180,
            cx: 150,
            cy: 100,
          },
        ]}
        height={230}
      />
    </div>
  );
}

export default DataAnalytics;
