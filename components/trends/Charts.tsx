"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { TrendEntry } from "../../lib/insights/compute";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const chartConfig = [
  {
    key: "recovery_score",
    label: "Recovery Score",
    color: "#0F172A",
    domain: [0, 100]
  },
  {
    key: "energy",
    label: "Energy",
    color: "#1D4ED8",
    domain: [1, 5]
  },
  {
    key: "sleep_hours",
    label: "Sleep Hours",
    color: "#16A34A",
    domain: [4, 10]
  },
  {
    key: "stress",
    label: "Stress",
    color: "#DC2626",
    domain: [1, 5]
  },
  {
    key: "training_load",
    label: "Training Load",
    color: "#7C3AED",
    domain: [0, 3]
  }
] as const;

export default function Charts({ data }: { data: TrendEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-800/10 bg-white p-4 text-sm text-ink-800">
        Add a few check-ins to start seeing your trends.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {chartConfig.map((config) => (
        <div
          key={config.key}
          className="rounded-2xl border border-ink-800/10 bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between text-sm">
            <span>{config.label}</span>
            <span className="text-xs text-ink-800/60">Last range</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                  stroke="#94A3B8"
                />
                <YAxis
                  domain={config.domain as [number, number]}
                  tick={{ fontSize: 11 }}
                  stroke="#94A3B8"
                />
                <Tooltip
                  labelFormatter={(value) => `Date: ${formatDate(String(value))}`}
                />
                <Line
                  type="monotone"
                  dataKey={config.key}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
