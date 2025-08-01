import { useState, useCallback } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isLoading: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isLoading,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      setError(null);

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find(
        (file) => file.type === 'text/csv' || file.name.endsWith('.csv')
      );

      if (!csvFile) {
        setError('Please select a CSV file');
        return;
      }

      if (csvFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }

      onFileSelect(csvFile);
    },
    [onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];

      if (!file) return;

      if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <div className="flex flex-col items-center space-y-2">
              <Button asChild>
                <label htmlFor="file-input" className="cursor-pointer">
                  Choose File
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports CSV files up to 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onFileRemove}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
