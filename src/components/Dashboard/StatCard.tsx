import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4  ">
      <p className="text-gray-600 text-xl font-bold mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  );
};
