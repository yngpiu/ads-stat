# 📊 Ads Analytics Dashboard

A comprehensive data analytics web application for analyzing Shopee advertising campaign data with interactive charts, statistics, and filtering capabilities.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## ✨ Features

### 📁 **File Upload**

- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **CSV Validation**: Automatic file type and size validation (max 10MB)
- **Error Handling**: Clear error messages for invalid files

### 📈 **Interactive Charts**

- **Top Keywords Performance**: Bar chart showing views, clicks, and cost for top 10 keywords
- **Cost vs Performance Analysis**: Area chart analyzing efficiency and cost relationships
- **Keyword Type Distribution**: Pie chart breakdown of keyword categories
- **Click Rate Trends**: Line chart showing performance trends over time
- **Views vs Clicks Comparison**: Comparative bar chart for engagement metrics

### 📊 **Statistics Dashboard**

- **Key Metrics Overview**: Total views, clicks, cost, GMV, and conversions
- **Performance Indicators**: Average click rates and conversion rates
- **Max/Min Analysis**: Highest and lowest performing metrics
- **Top Keywords**: Best performing keywords by various criteria

### 📋 **Data Table**

- **Advanced Filtering**: Search by keyword or search command
- **Column Sorting**: Sort by any column with visual indicators
- **Keyword Type Filter**: Filter data by keyword categories
- **Pagination**: Efficient data browsing with customizable page sizes
- **CSV Export**: Export filtered data to CSV format

### 🎨 **User Interface**

- **Modern Design**: Built with shadcn/ui components
- **Responsive Layout**: Works on desktop and mobile devices
- **Dark/Light Mode Ready**: Prepared for theme switching
- **Loading States**: Visual feedback during data processing

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Bun** (package manager)
- **Modern web browser**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ads-stat
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start development server**

   ```bash
   bun dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📖 How to Use

### 1. **Upload Your Data**

- Click the upload area or drag and drop your CSV file
- Supported format: Shopee advertising campaign export files
- File size limit: 10MB maximum

### 2. **Explore Statistics**

- View the **Overview** tab for key metrics and performance indicators
- Check top performing keywords and campaign statistics
- Analyze max/min values across different metrics

### 3. **Analyze Charts**

- Navigate to the **Charts** tab for visual data analysis
- Interact with different chart types to understand trends
- Compare performance across keywords and categories

### 4. **Browse Detailed Data**

- Use the **Data Table** tab for detailed record viewing
- **Search**: Type keywords to filter results
- **Filter**: Select specific keyword types
- **Sort**: Click column headers to sort (click twice to reverse)
- **Export**: Download filtered data as CSV

### 5. **Export Results**

- Use the Export CSV button in the data table
- Downloads currently filtered and sorted data
- Includes all visible columns in the export

## 📂 Project Structure

```
ads-stat/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── DataCharts.tsx   # Chart components using Recharts
│   │   ├── DataTable.tsx    # Sortable/filterable data table
│   │   ├── FileUpload.tsx   # Drag & drop file upload
│   │   └── StatisticsDashboard.tsx  # Statistics overview
│   ├── lib/                 # Utility functions
│   │   ├── csv-parser.ts    # CSV parsing and data processing
│   │   └── utils.ts         # shadcn/ui utilities
│   ├── routes/              # Application routes
│   │   └── home.tsx         # Main dashboard page
│   └── ui/                  # shadcn/ui components
├── public/                  # Static assets
├── components.json          # shadcn/ui configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## 🛠️ Technologies Used

### **Frontend Framework**

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing

### **UI Components**

- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### **Data Visualization**

- **Recharts** - Responsive chart library
- **PapaCSV** - CSV parsing and processing

### **Build Tools**

- **Vite** - Fast build tool and dev server
- **Bun** - Fast package manager and runtime

### **Development**

- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📊 Supported Data Format

The application expects CSV files with the following structure:

```csv
Báo cáo Sản phẩm - Shopee Việt Nam
Tên người dùng: [username]
Tên Shop: [shop_name]
Seller ID: [seller_id]
Tên quảng cáo: [ad_name]
ID sản phẩm: [product_id]
Thời gian tạo báo cáo: [timestamp]
Khoảng thời gian: [date_range]

STT,Từ khóa,Loại từ khóa,Lệnh tìm kiếm,Phương thức đấu giá,Lượt hiển thị,Lượt nhấp,...
```

## 🎯 Key Features Breakdown

### **Smart Data Processing**

- Automatic header extraction from CSV files
- Intelligent data type conversion
- Statistical calculations (totals, averages, extremes)
- Top performer identification

### **Advanced Sorting**

- Numeric sorting for numbers
- Percentage-aware sorting for rates
- String-based sorting for text fields
- Visual sort direction indicators

### **Performance Optimized**

- Pagination for large datasets
- Memoized calculations
- Efficient filtering and searching
- Responsive chart rendering

## 🚀 Deployment

### **Netlify Deployment**

This project is configured for easy deployment on Netlify:

1. **Connect your repository** to Netlify
2. **Build settings** are automatically configured via `netlify.toml`:
   - Build command: `bun run build`
   - Publish directory: `build/client`
3. **Deploy** - Netlify will automatically build and deploy your site

The included configuration files handle:

- **SPA Routing**: `_redirects` file ensures React Router works correctly
- **Build Optimization**: Proper cache headers for static assets
- **Environment**: Node.js 18+ for build process

### **Manual Deployment Steps**

1. **Build the project locally**:

   ```bash
   bun run build
   ```

2. **Deploy the `build/client` folder** to your hosting service

3. **Configure redirects** - Ensure your hosting service redirects all routes to `index.html` for SPA functionality

### **Other Hosting Platforms**

- **Vercel**: Works out of the box with React Router v7
- **Cloudflare Pages**: Use the `_redirects` file configuration
- **GitHub Pages**: Requires additional configuration for SPA routing

## 🔧 Customization

### **Adding New Chart Types**

Edit `app/components/DataCharts.tsx` to add new visualizations:

```tsx
// Add new chart component
<Card>
  <CardHeader>
    <CardTitle>Your Custom Chart</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={400}>
      {/* Your chart component */}
    </ResponsiveContainer>
  </CardContent>
</Card>
```

### **Extending Data Processing**

Modify `app/lib/csv-parser.ts` to handle additional data formats:

```tsx
// Add new fields to AdData interface
export interface AdData {
  // existing fields...
  newField: number;
}
```

## 🐛 Troubleshooting

### **Common Issues**

**File Upload Not Working**

- Check file size (must be under 10MB)
- Ensure file is in CSV format
- Verify CSV structure matches expected format

**Charts Not Displaying**

- Ensure data was successfully parsed
- Check browser console for errors
- Verify recharts dependencies are installed

**Sorting Not Working**

- Check that data types match expected formats
- Verify percentage fields contain valid percentage strings
- Ensure numeric fields are properly converted

### **Performance Issues**

- For large files (>1000 rows), consider pagination
- Clear browser cache if experiencing slow loading
- Check available memory for very large datasets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**
