import { useState } from 'react';
import type { Route } from './+types/home';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Progress } from '~/components/ui/progress';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { FileUpload } from '~/components/FileUpload';
import { StatisticsDashboard } from '~/components/StatisticsDashboard';
import { DataCharts } from '~/components/DataCharts';
import { DataTable } from '~/components/DataTable';
import { parseCSVData } from '~/lib/csv-parser';
import type { ParsedAdData } from '~/lib/csv-parser';
import { BarChart3, FileText, Table, Upload } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Ad Data Analytics Dashboard' },
    {
      name: 'description',
      content:
        'Analyze your advertising data with comprehensive statistics and visualizations',
    },
  ];
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedAdData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const parsed = parseCSVData(text);

      if (!parsed) {
        throw new Error(
          'Failed to parse CSV file. Please check the file format.'
        );
      }

      setParsedData(parsed);
      setActiveTab('overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setParsedData(null);
    setError(null);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ad Data Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Upload your CSV files and get comprehensive insights with
            interactive charts and statistics
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFile={selectedFile}
            isLoading={isLoading}
          />
        </div>

        {/* Loading Progress */}
        {isLoading && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">
                Processing your data...
              </span>
            </div>
            <Progress value={75} className="w-full" />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Analytics Dashboard */}
        {parsedData && !isLoading && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Data Table
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <StatisticsDashboard data={parsedData} />
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <StatisticsDashboard data={parsedData} />
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <DataCharts data={parsedData} />
            </TabsContent>

            <TabsContent value="table" className="space-y-6">
              <DataTable data={parsedData} />
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {!selectedFile && !isLoading && (
          <div className="text-center py-12">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data uploaded yet
            </h3>
            <p className="text-gray-500">
              Upload a CSV file to start analyzing your advertising data
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Built with React Router, shadcn/ui, and Recharts</p>
        </footer>
      </div>
    </div>
  );
}
