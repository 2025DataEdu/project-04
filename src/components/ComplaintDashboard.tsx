
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useComplaints } from '@/hooks/useComplaints';
import { TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ComplaintDashboard = () => {
  const { stats, isLoading } = useComplaints();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value
  }));

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 민원</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">총 접수된 민원</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">해결 완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">해결된 민원</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">처리 대기</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">처리 중인 민원</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">해결률</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">전체 민원 중 해결률</p>
          </CardContent>
        </Card>
      </div>

      {/* 우선순위 알림 - 차트들 위로 이동 */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              주요 민원 카테고리
            </CardTitle>
            <CardDescription>자주 발생하는 민원 유형</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoryData
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((category, index) => (
                  <Badge
                    key={category.name}
                    variant={index === 0 ? "destructive" : index === 1 ? "default" : "secondary"}
                  >
                    {category.name} ({category.value}건)
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월별 민원 추이 */}
        <Card>
          <CardHeader>
            <CardTitle>월별 민원 추이</CardTitle>
            <CardDescription>최근 12개월간 민원 접수 및 해결 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="접수" />
                <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="해결" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 카테고리별 민원 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 민원 분포</CardTitle>
            <CardDescription>민원 유형별 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 상세 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리별 상세 현황</CardTitle>
          <CardDescription>각 카테고리별 민원 건수</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintDashboard;
