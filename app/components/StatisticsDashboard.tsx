import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import type { ParsedAdData } from '~/lib/csv-parser';
import {
  Eye,
  MousePointer,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface StatisticsDashboardProps {
  data: ParsedAdData;
}

export function StatisticsDashboard({ data }: StatisticsDashboardProps) {
  const { statistics, header } = data;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  const statCards = [
    {
      title: 'Total Views',
      value: formatNumber(statistics.totalViews),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Clicks',
      value: formatNumber(statistics.totalClicks),
      icon: MousePointer,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Cost',
      value: formatCurrency(statistics.totalCost),
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total GMV',
      value: formatCurrency(statistics.totalGmv),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Conversions',
      value: formatNumber(statistics.totalConversions),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Avg Click Rate',
      value: statistics.averageClickRate.toFixed(2) + '%',
      icon: BarChart3,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Report Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Store Name
            </p>
            <p className="text-base font-semibold">{header.storeName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Ad Campaign
            </p>
            <p className="text-base font-semibold">{header.adName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Time Range
            </p>
            <p className="text-base font-semibold">{header.timeRange}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Product ID
            </p>
            <p className="text-base font-semibold">{header.productId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Seller ID
            </p>
            <p className="text-base font-semibold">{header.sellerId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Generated
            </p>
            <p className="text-base font-semibold">
              {header.reportCreationTime}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Max/Min Values */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-green-600" />
              Maximum Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Views:</span>
              <Badge variant="secondary">
                {formatNumber(statistics.maxValues.views)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Clicks:</span>
              <Badge variant="secondary">
                {formatNumber(statistics.maxValues.clicks)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cost:</span>
              <Badge variant="secondary">
                {formatCurrency(statistics.maxValues.cost)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">GMV:</span>
              <Badge variant="secondary">
                {formatCurrency(statistics.maxValues.gmv)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-red-600" />
              Minimum Values (Non-zero)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Views:</span>
              <Badge variant="outline">
                {formatNumber(statistics.minValues.views)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Clicks:</span>
              <Badge variant="outline">
                {formatNumber(statistics.minValues.clicks)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cost:</span>
              <Badge variant="outline">
                {formatCurrency(statistics.minValues.cost)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">GMV:</span>
              <Badge variant="outline">
                {formatCurrency(statistics.minValues.gmv)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Keywords by Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.topKeywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{keyword.keyword}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatNumber(keyword.views)} views</span>
                  <span>{formatNumber(keyword.clicks)} clicks</span>
                  <span>{formatCurrency(keyword.cost)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
