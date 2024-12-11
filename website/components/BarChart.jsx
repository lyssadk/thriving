import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ year }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`/api/sales?year=${year}`);
        const data = await response.json();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
        const salesData = months.map((month, index) => {
          const monthData = data.find(d => parseInt(d.month) === index + 1);
          console.log(monthData);
          return monthData ? monthData.total_gross_sales : 0;
        });

        console.log(salesData);

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Gross Sales',
              data: salesData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [year]);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Gross Sales by Month ({year})</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
