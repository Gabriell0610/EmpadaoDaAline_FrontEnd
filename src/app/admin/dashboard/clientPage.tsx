'use client';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  XCircle,
  CheckCheckIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card/card';
import { CardContent } from '@/components/CardContent/cardContent';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAdminRequest } from '../functions';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';
import { DashboardRevenueInterface } from '@/utils/types/dashboard.type';

export default function DashboardAdmin({ session }: ProfilePageProps) {
  const {
    contentDashboardSummary,
    setDashboardPeriod,
    dashboardPeriod,
    contentDashboardRevenue,
  } = useAdminRequest({
    session,
  });

  useEffect(() => {
    console.log(
      'Revenue:',
      contentDashboardRevenue,
      Array.isArray(contentDashboardRevenue),
    );
  });

  const revenueData: DashboardRevenueInterface[] = Array.isArray(
    contentDashboardRevenue,
  )
    ? contentDashboardRevenue
    : [];

  const isActive = (value: string) => dashboardPeriod === value;

  return (
    <div className="space-y-6 p-6">
      {/* Header / Filters */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={twMerge(isActive('today') ? 'bg-gray-200' : '')}
            onClick={() => setDashboardPeriod('today')}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            className={twMerge(isActive('7d') ? 'bg-gray-200' : '')}
            onClick={() => setDashboardPeriod('7d')}
          >
            7 dias
          </Button>
          <Button
            variant="outline"
            className={twMerge(isActive('1m') ? 'bg-gray-200' : '')}
            onClick={() => setDashboardPeriod('1m')}
          >
            Mês
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp size={16} /> Faturamento
            </div>
            <p className="text-2xl font-bold">
              {contentDashboardSummary?.totalRevenue}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart size={16} /> Pedidos
            </div>
            <p className="text-2xl font-bold">
              {contentDashboardSummary?.totalOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} /> Em andamento
            </div>
            <p className="text-2xl font-bold">
              {contentDashboardSummary?.orderInProgress}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <XCircle size={16} /> Cancelados
            </div>
            <p className="text-2xl font-bold">
              {contentDashboardSummary?.cancelOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCheckIcon size={16} /> Entregues
            </div>
            <p className="text-2xl font-bold">
              {contentDashboardSummary?.orderDelivered}
            </p>
          </CardContent>
        </Card>
      </div>

      {dashboardPeriod !== 'today' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="h-64">
              <CardContent className="h-full p-4">
                <h2 className="mb-2 font-medium">Faturamento por período</h2>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        typeof value === 'number' ? `R$ ${value}` : value
                      }
                    />
                    <Line
                      type="linear"
                      dataKey="value"
                      strokeWidth={2}
                      dot={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
