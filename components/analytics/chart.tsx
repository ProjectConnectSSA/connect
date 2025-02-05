"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

interface ChartProps {
  data: { name: string; value: number }[];
}

// ✅ Accept `data` as a prop in `BarChart`
export function BarChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}>
      <RechartsBarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
        />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// ✅ Accept `data` as a prop in `LineChart`
export function LineChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}>
      <RechartsLineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="currentColor"
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// ✅ Accept `data` as a prop in `PieChart`
interface PieChartProps {
  data: { name: string; value: number; color: string }[];
}

export function PieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
