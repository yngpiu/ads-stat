import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from 'lucide-react';
import type { AdData, ParsedAdData } from '~/lib/csv-parser';

interface DataTableProps {
  data: ParsedAdData;
}

type SortField = keyof AdData;
type SortDirection = 'asc' | 'desc';

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywordTypeFilter, setKeywordTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Get unique keyword types for filter
  const keywordTypes = useMemo(() => {
    const types = new Set(
      data.data.map((item) => item.keywordType).filter(Boolean)
    );
    return Array.from(types);
  }, [data.data]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.data.filter((item) => {
      const matchesSearch =
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.searchCommand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        keywordTypeFilter === 'all' || item.keywordType === keywordTypeFilter;

      return matchesSearch && matchesType;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle numeric fields
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle percentage strings (like clickRate)
      if (
        sortField === 'clickRate' ||
        sortField === 'conversionRate' ||
        sortField === 'directConversionRate' ||
        sortField === 'roas' ||
        sortField === 'directRoas' ||
        sortField === 'acos' ||
        sortField === 'directAcos'
      ) {
        const aNum = parseFloat(String(aValue).replace('%', '')) || 0;
        const bNum = parseFloat(String(bValue).replace('%', '')) || 0;
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle string fields
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [data.data, searchTerm, keywordTypeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const getSortButtonClass = (field: SortField) => {
    const baseClass = 'h-8 p-0';
    return sortField === field
      ? `${baseClass} text-primary font-medium`
      : baseClass;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  const exportToCSV = () => {
    const headers = [
      'Order',
      'Keyword',
      'Type',
      'Search Command',
      'Views',
      'Clicks',
      'Click Rate',
      'Conversions',
      'Cost',
      'GMV',
      'Avg Rank',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map((row) =>
        [
          row.order,
          `"${row.keyword}"`,
          `"${row.keywordType}"`,
          `"${row.searchCommand}"`,
          row.views,
          row.clicks,
          row.clickRate,
          row.conversions,
          row.cost,
          row.gmv,
          row.averageRank,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_ad_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle>Detailed Data Table</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {filteredAndSortedData.length} of {data.data.length} records
            </Badge>
            <Button onClick={exportToCSV} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search keywords or commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={keywordTypeFilter}
              onValueChange={setKeywordTypeFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {keywordTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('order')}
                    className={getSortButtonClass('order')}
                  >
                    #{getSortIcon('order')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-48">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('keyword')}
                    className={getSortButtonClass('keyword')}
                  >
                    Keyword
                    {getSortIcon('keyword')}
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="min-w-32">Search Command</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('views')}
                    className={getSortButtonClass('views')}
                  >
                    Views
                    {getSortIcon('views')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('clicks')}
                    className={getSortButtonClass('clicks')}
                  >
                    Clicks
                    {getSortIcon('clicks')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('clickRate')}
                    className={getSortButtonClass('clickRate')}
                  >
                    Click Rate
                    {getSortIcon('clickRate')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('conversions')}
                    className={getSortButtonClass('conversions')}
                  >
                    Conv.
                    {getSortIcon('conversions')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('cost')}
                    className={getSortButtonClass('cost')}
                  >
                    Cost
                    {getSortIcon('cost')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('gmv')}
                    className={getSortButtonClass('gmv')}
                  >
                    GMV
                    {getSortIcon('gmv')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('averageRank')}
                    className={getSortButtonClass('averageRank')}
                  >
                    Rank
                    {getSortIcon('averageRank')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.order}>
                  <TableCell className="font-medium">{item.order}</TableCell>
                  <TableCell className="max-w-64">
                    <div className="truncate" title={item.keyword}>
                      {item.keyword}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.keywordType}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-32">
                    <div className="truncate" title={item.searchCommand}>
                      {item.searchCommand}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.views)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.clicks)}
                  </TableCell>
                  <TableCell className="text-right">{item.clickRate}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.conversions)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.cost > 0 ? formatCurrency(item.cost) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.gmv > 0 ? formatCurrency(item.gmv) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.averageRank || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{' '}
              {Math.min(
                startIndex + itemsPerPage,
                filteredAndSortedData.length
              )}{' '}
              of {filteredAndSortedData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((current) => Math.max(1, current - 1))
                }
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
