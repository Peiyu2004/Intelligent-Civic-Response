import { Report } from '../types';

export const getSeverityColor = (severity: number): string => {
  if (severity >= 7) return '#dc2626'; // red
  if (severity >= 4) return '#f97316'; // orange
  return '#22c55e'; // green
};

export const getSeverityLabel = (severity: number): string => {
  if (severity >= 7) return 'High';
  if (severity >= 4) return 'Medium';
  return 'Low';
};

export const getStatusColor = (status: string): string => {
  return status === 'completed' ? 'text-green-500' : 'text-red-500';
};

export const getSeverityFilterLabel = (filter: string): string => {
  switch (filter) {
    case 'high':
      return 'High (7-10)';
    case 'medium':
      return 'Medium (4-6)';
    case 'low':
      return 'Low (1-3)';
    default:
      return 'All';
  }
};

export const filterReportsBySeverity = (reports: Report[], filter: string): Report[] => {
  if (filter === 'all') return reports;
  if (filter === 'high') return reports.filter(r => r.severity >= 7);
  if (filter === 'medium') return reports.filter(r => r.severity >= 4 && r.severity < 7);
  if (filter === 'low') return reports.filter(r => r.severity < 4);
  return reports;
};

export const filterReportsByLocation = (reports: Report[], location: string): Report[] => {
  if (!location) return reports;
  return reports.filter(r => r.location.toLowerCase().includes(location.toLowerCase()));
};

export const filterReportsByStatus = (reports: Report[], status: string): Report[] => {
  if (status === 'all') return reports;
  return reports.filter(r => r.status === status);
};

export const filterReportsByCluster = (reports: Report[], clusterId: string): Report[] => {
  if (!clusterId) return reports;
  return reports.filter(r => r.clusterId === clusterId);
};