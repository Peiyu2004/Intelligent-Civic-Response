import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IssueTypeData } from "../../types";

interface IssueTypeChartProps {
  data: IssueTypeData[];
}

export const IssueTypeChart: React.FC<IssueTypeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-l-indigo-100 p-5">
      <h2 className="text-2xl font-black pb-4 ">Issue Type Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#6750A4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
