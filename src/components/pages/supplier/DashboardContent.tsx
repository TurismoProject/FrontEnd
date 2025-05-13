"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { SupplierDashboard, Order, BookingStatus } from "@/lib/interfaces";
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
import { getSupplierDashboardData } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardContent() {
  const { accessToken } = useAuth();

  const [dashboardData, setDashboardData] = useState<SupplierDashboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await getSupplierDashboardData(accessToken as string);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading dashboard data...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        Failed to load dashboard data
      </div>
    );
  }

  // Calculate percentage of order statuses for visualization
  const totalOrders = dashboardData.totalOrders;
  const completedPercentage =
    (dashboardData.totalCompletedOrders / totalOrders) * 100;
  const pendingPercentage =
    (dashboardData.totalPendingOrders / totalOrders) * 100;
  const cancelledPercentage =
    (dashboardData.totalCancelledOrders / totalOrders) * 100;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Format percentage change
  const formatPercentageChange = (value: number) => {
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vendas Totais
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.totalSales)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {dashboardData.salesComparison.percentageChange > 0 ? (
                    <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      dashboardData.salesComparison.percentageChange > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {formatPercentageChange(
                      dashboardData.salesComparison.percentageChange
                    )}{" "}
                    em relação ao mês anterior
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.totalOrders}
                </div>
                <div className="mt-2 flex gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                    <span>
                      Concluídos: {dashboardData.totalCompletedOrders}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span>Pendentes: {dashboardData.totalPendingOrders}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.totalProducts}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de produtos cadastrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Conclusão
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedPercentage.toFixed(1)}%
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${completedPercentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>
                  Você tem {dashboardData.recentOrders.length} pedidos recentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground">
                    <div>Pedido</div>
                    <div>Cliente</div>
                    <div>Data</div>
                    <div>Status</div>
                    <div className="text-right">Valor</div>
                  </div>
                  {dashboardData.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="grid grid-cols-5 text-sm py-2 border-t"
                    >
                      <div className="font-medium">{order.id}</div>
                      <div>{order.customerName}</div>
                      <div>{order.date.toLocaleDateString("pt-BR")}</div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === BookingStatus.COMPLETED
                              ? "bg-green-100 text-green-700"
                              : order.status === BookingStatus.CONFIRMED
                              ? "bg-blue-100 text-blue-700"
                              : order.status === BookingStatus.PENDING
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === BookingStatus.COMPLETED
                            ? "Concluído"
                            : order.status === BookingStatus.CONFIRMED
                            ? "Confirmado"
                            : order.status === BookingStatus.PENDING
                            ? "Pendente"
                            : "Cancelado"}
                        </span>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(order.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Vendas Mensais</CardTitle>
                <CardDescription>
                  Comparação de vendas dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.salesComparison.monthlySales}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Bar dataKey="sales" name="Vendas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada</CardTitle>
              <CardDescription>
                Visualize métricas detalhadas do seu negócio.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Os gráficos de análise serão implementados aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Gere e visualize relatórios.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                A funcionalidade de relatórios será implementada aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Suas notificações recentes.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                As notificações serão exibidas aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
