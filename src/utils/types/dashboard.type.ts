export interface DashboardSummaryDto {
  totalRevenue: number;
  totalOrders: number;
  orderInProgress: number;
  cancelOrders: number;
  orderDelivered: number;
}

export interface DashboardRevenueInterface {
  label: string;
  value: number;
}

export interface DashboardQuickStatsInterface {
  scheduledToday: number;
  deliveriesDueToday: number;
  canceledToday: number;
  totalDelivered: number;
  inProgressOrdersToday: number;
}

export type DashboardPeriodType = 'today' | '7d' | '1m';
