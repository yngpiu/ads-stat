import Papa from 'papaparse';

export interface AdData {
  order: number;
  keyword: string;
  keywordType: string;
  searchCommand: string;
  biddingMethod: string;
  views: number;
  clicks: number;
  clickRate: string;
  conversions: number;
  directConversions: number;
  conversionRate: string;
  directConversionRate: string;
  costPerConversion: string;
  directCostPerConversion: string;
  productsSold: number;
  directProductsSold: number;
  gmv: number;
  directGmv: number;
  cost: number;
  averageRank: number;
  roas: string;
  directRoas: string;
  acos: string;
  directAcos: string;
}

export interface AdReportHeader {
  reportTitle: string;
  username: string;
  storeName: string;
  sellerId: string;
  adName: string;
  productId: string;
  reportCreationTime: string;
  timeRange: string;
}

export interface ParsedAdData {
  header: AdReportHeader;
  data: AdData[];
  statistics: {
    totalViews: number;
    totalClicks: number;
    totalCost: number;
    totalGmv: number;
    totalConversions: number;
    averageClickRate: number;
    averageConversionRate: number;
    topKeywords: Array<{
      keyword: string;
      views: number;
      clicks: number;
      cost: number;
    }>;
    maxValues: {
      views: number;
      clicks: number;
      cost: number;
      gmv: number;
    };
    minValues: {
      views: number;
      clicks: number;
      cost: number;
      gmv: number;
    };
  };
}

export function parseCSVData(csvText: string): ParsedAdData | null {
  try {
    const lines = csvText.split('\n').filter((line) => line.trim());

    // Parse header information
    const header: AdReportHeader = {
      reportTitle: lines[0] || '',
      username: lines[1]?.split(',')[1] || '',
      storeName: lines[2]?.split(',')[1] || '',
      sellerId: lines[3]?.split(',')[1] || '',
      adName: lines[4]?.split(',')[1] || '',
      productId: lines[5]?.split(',')[1] || '',
      reportCreationTime: lines[7]?.split(',')[1] || '',
      timeRange: lines[8]?.split(',')[1] || '',
    };

    // Find the data section starting from line with column headers
    let dataStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Thứ tự,Từ khóa,Loại từ khóa')) {
        dataStartIndex = i + 1;
        break;
      }
    }

    if (dataStartIndex === -1) {
      throw new Error('Could not find data section in CSV');
    }

    // Parse data rows
    const dataLines = lines.slice(dataStartIndex);
    const data: AdData[] = [];

    for (const line of dataLines) {
      if (!line.trim()) continue;

      const parsed = Papa.parse(line, { delimiter: ',' });
      if (parsed.data && parsed.data[0] && Array.isArray(parsed.data[0])) {
        const row = parsed.data[0] as string[];

        if (row.length >= 24) {
          const adData: AdData = {
            order: parseInt(row[0]) || 0,
            keyword: row[1] || '',
            keywordType: row[2] || '',
            searchCommand: row[3] || '',
            biddingMethod: row[4] || '',
            views: parseInt(row[5]) || 0,
            clicks: parseInt(row[6]) || 0,
            clickRate: row[7] || '',
            conversions: parseInt(row[8]) || 0,
            directConversions: parseInt(row[9]) || 0,
            conversionRate: row[10] || '',
            directConversionRate: row[11] || '',
            costPerConversion: row[12] || '',
            directCostPerConversion: row[13] || '',
            productsSold: parseInt(row[14]) || 0,
            directProductsSold: parseInt(row[15]) || 0,
            gmv: parseInt(row[16]) || 0,
            directGmv: parseInt(row[17]) || 0,
            cost: parseInt(row[18]) || 0,
            averageRank: parseInt(row[19]) || 0,
            roas: row[20] || '',
            directRoas: row[21] || '',
            acos: row[22] || '',
            directAcos: row[23] || '',
          };
          data.push(adData);
        }
      }
    }

    // Calculate statistics
    const totalViews = data.reduce((sum, item) => sum + item.views, 0);
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
    const totalGmv = data.reduce((sum, item) => sum + item.gmv, 0);
    const totalConversions = data.reduce(
      (sum, item) => sum + item.conversions,
      0
    );

    const averageClickRate =
      totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    const averageConversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Top keywords by views
    const topKeywords = data
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
      .map((item) => ({
        keyword: item.keyword,
        views: item.views,
        clicks: item.clicks,
        cost: item.cost,
      }));

    // Max values
    const maxValues = {
      views: Math.max(...data.map((item) => item.views)),
      clicks: Math.max(...data.map((item) => item.clicks)),
      cost: Math.max(...data.map((item) => item.cost)),
      gmv: Math.max(...data.map((item) => item.gmv)),
    };

    // Min values (excluding zeros)
    const nonZeroViews = data
      .filter((item) => item.views > 0)
      .map((item) => item.views);
    const nonZeroClicks = data
      .filter((item) => item.clicks > 0)
      .map((item) => item.clicks);
    const nonZeroCost = data
      .filter((item) => item.cost > 0)
      .map((item) => item.cost);
    const nonZeroGmv = data
      .filter((item) => item.gmv > 0)
      .map((item) => item.gmv);

    const minValues = {
      views: nonZeroViews.length > 0 ? Math.min(...nonZeroViews) : 0,
      clicks: nonZeroClicks.length > 0 ? Math.min(...nonZeroClicks) : 0,
      cost: nonZeroCost.length > 0 ? Math.min(...nonZeroCost) : 0,
      gmv: nonZeroGmv.length > 0 ? Math.min(...nonZeroGmv) : 0,
    };

    const statistics = {
      totalViews,
      totalClicks,
      totalCost,
      totalGmv,
      totalConversions,
      averageClickRate,
      averageConversionRate,
      topKeywords,
      maxValues,
      minValues,
    };

    return {
      header,
      data,
      statistics,
    };
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return null;
  }
}
