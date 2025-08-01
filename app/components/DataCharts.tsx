import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import type { ParsedAdData } from '~/lib/csv-parser';

interface DataChartsProps {
  data: ParsedAdData;
}

export function DataCharts({ data }: DataChartsProps) {
  // Prepare data for charts
  const topKeywordsData = data.statistics.topKeywords
    .slice(0, 10)
    .map((keyword) => ({
      name:
        keyword.keyword.length > 20
          ? keyword.keyword.substring(0, 20) + '...'
          : keyword.keyword,
      views: keyword.views,
      clicks: keyword.clicks,
      cost: keyword.cost,
    }));

  // Cost vs Performance data
  const costPerformanceData = data.data
    .filter((item) => item.views > 0 && item.cost > 0)
    .slice(0, 20)
    .map((item) => ({
      keyword:
        item.keyword.length > 15
          ? item.keyword.substring(0, 15) + '...'
          : item.keyword,
      cost: item.cost,
      views: item.views,
      clicks: item.clicks,
      efficiency: item.views > 0 ? (item.clicks / item.views) * 100 : 0,
    }));

  // Keyword type distribution
  const keywordTypeData = data.data.reduce(
    (acc, item) => {
      const type = item.keywordType || 'Unknown';
      if (!acc[type]) {
        acc[type] = { name: type, count: 0, totalViews: 0, totalClicks: 0 };
      }
      acc[type].count += 1;
      acc[type].totalViews += item.views;
      acc[type].totalClicks += item.clicks;
      return acc;
    },
    {} as Record<
      string,
      { name: string; count: number; totalViews: number; totalClicks: number }
    >
  );

  const keywordTypePieData = Object.values(keywordTypeData);

  // Performance trend data (top 15 keywords by order)
  const trendData = data.data.slice(0, 15).map((item) => ({
    order: item.order,
    views: item.views,
    clicks: item.clicks,
    cost: item.cost,
    clickRate:
      item.clicks > 0 && item.views > 0 ? (item.clicks / item.views) * 100 : 0,
  }));

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Top Keywords Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Keywords Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topKeywordsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'cost'
                    ? formatCurrency(Number(value))
                    : formatNumber(Number(value)),
                  name === 'views'
                    ? 'Views'
                    : name === 'clicks'
                      ? 'Clicks'
                      : 'Cost',
                ]}
              />
              <Bar dataKey="views" fill="#0088FE" name="views" />
              <Bar dataKey="clicks" fill="#00C49F" name="clicks" />
              <Bar dataKey="cost" fill="#FF8042" name="cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost vs Performance Scatter */}
      <Card>
        <CardHeader>
          <CardTitle>Cost vs Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={costPerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="keyword"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'cost'
                    ? formatCurrency(Number(value))
                    : name === 'efficiency'
                      ? Number(value).toFixed(2) + '%'
                      : formatNumber(Number(value)),
                  name === 'cost'
                    ? 'Cost'
                    : name === 'efficiency'
                      ? 'Click Rate'
                      : name === 'views'
                        ? 'Views'
                        : 'Clicks',
                ]}
              />
              <Area
                dataKey="cost"
                stackId="1"
                stroke="#FF8042"
                fill="#FF8042"
                fillOpacity={0.6}
              />
              <Area
                dataKey="efficiency"
                stackId="2"
                stroke="#8884D8"
                fill="#8884D8"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Keyword Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={keywordTypePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {keywordTypePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Keywords']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Click Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="order" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toFixed(2) + '%',
                    'Click Rate',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="clickRate"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Views vs Clicks Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Views vs Clicks Comparison (Top 15 Keywords)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  formatNumber(Number(value)),
                  name === 'views' ? 'Views' : 'Clicks',
                ]}
              />
              <Bar dataKey="views" fill="#0088FE" name="views" />
              <Bar dataKey="clicks" fill="#00C49F" name="clicks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
