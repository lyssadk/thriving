// pages/dashboard.js
import { useState, useEffect, use } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import BarChart from '../components/BarChart';

const box = {
  border: '1px solid black',
  padding: '10px',
  margin: '10px',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const DashboardPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [salesTax, setSalesTax] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [shippingTotal, setShippingTotal] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [year, setYear] = useState(2024);
  useEffect(() => {
    const fileInput = document.getElementById('file');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      setCsvFile(file);
    });

    return () => {
      fileInput.removeEventListener('change', (e) => {
        const file = e.target.files[0];
        setCsvFile(file);
      });
    };
  }
  , []);

  useEffect(() => {
    fetch(`/api/dashboard?year=${year}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSalesTax(data[0].total_tax);
        setTotalSales(data[0].total_gross_sales);
        setTotalSpent(data[0].total_collected);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, [year]);

  useEffect(() => {
    fetch(`/api/shipping?year=${year}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setShippingTotal(data[0].total_shipping_cost);
      })
      .catch(error => {
        console.error('Error fetching shipping data:', error);
      });
  }, [year]);

  function handleFileUpload() {
    // Get the file selected by the user from the input element
    const fileInput = document.getElementById('file');
    const csvFile = fileInput.files[0]; // Get the first selected file
    
    if (csvFile) {
      // If a file is selected, pass it to the updateDashboard function
      updateDashboard(csvFile);
    } else {
      // If no file is selected, show an alert or handle the case accordingly
      alert('Please select a CSV file to upload.');
    }

    // get total sales tax, total collected and total gross sales for each year from the /api/dashboard endpoint
  }
  
  function updateDashboard(csvFile) {
    // Make sure csvFile is a valid File object (or Blob)
    if (!(csvFile instanceof Blob)) {
      console.error('The argument must be a File or Blob');
      return;
    }
  
    // Create a FileReader to read the file
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n'); // Split by rows
      let salesTax = 0;
  
      // Iterate through each line (skip the first line if it's headers)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines or invalid rows
        if (!line) continue;
        console.log(line)
        const columns = line.split(','); // Split line by commas to get columns
        let newtax = 0;
        let newNetSales = 0;
        let newGrossSales = 0;

        const tax = columns[8]?.trim();  
        const gross_sales = columns[3]?.trim();
        const dateString = columns[0]?.trim();
        console.log(dateString)
        const date = new Date(dateString).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        console.log(date)
        const total_collected = columns[6]?.trim();
        const transaction_id = columns[22]?.trim();


        if (tax && tax.startsWith('$')) {
          newtax = tax.replace('$', '');  // Remove the dollar sign
        }
        if (gross_sales && gross_sales.startsWith('$')) {
          newGrossSales = gross_sales.replace('$', '');  // Remove the dollar sign
        }
        if (total_collected && total_collected.startsWith('$')) {
          newNetSales = total_collected.replace('$', '');  // Remove the dollar sign
        }
        // Create a new transaction object
        const transaction = {
          tax: parseFloat(newtax) || 0,
          gross_sales: parseFloat(newGrossSales) || 0,
          total_collected: parseFloat(newNetSales) || 0,
          date: date,
          transaction_id: transaction_id
        };

        // Send the transaction to the /api/transactions endpoint
        fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transaction)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Transaction added:', data);
        })
        .catch(error => {
          console.error('Error adding transaction:', error);
        });
        
      }
  
    };
  
    reader.readAsText(csvFile); // Read the CSV file as text
  }


    const linkStyle = { textDecoration: 'none', margin: '10px' };
    const listItemStyle = { margin: '10px 0' };
    const containerStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '0 auto', width: '60%', textAlign: 'center' };

    return (
      <Layout>
      <div style={{ textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <p>Welcome to the Dashboard!</p>
        <p>Here you can upload a CSV file to update the dashboard with the latest data.</p>
        <h2>Quick Links</h2>
        <ul style={{ listStyleType: 'none', padding: 0, color: 'greenyellow', display: 'flex', justifyContent: 'center' }}>
        <li style={listItemStyle}>
          <Link href="/update-receipt/create-receipt" style={{ ...linkStyle, color: 'green' }}>Create Receipt</Link>
        </li>
        <li style={listItemStyle}>
          <Link href="/receipts" style={{ ...linkStyle, color: 'darkgreen' }}>View Orders</Link>
        </li>
        <li style={listItemStyle}>
          <Link href="/add-company" style={{ ...linkStyle, color: 'green' }}>Add Company</Link>
        </li>
        <li style={listItemStyle}>
          <Link href="/product-page/add-product" style={{ ...linkStyle, color: 'green' }}>Add Product</Link>
        </li>
        <li style={listItemStyle}>
          <Link href="/email" style={{ ...linkStyle, color: 'blue' }}>Email Fetcher</Link>
        </li>
        <li style={listItemStyle}>
          <Link href="/company/company-links" style={{ ...linkStyle, color: 'green' }}>Companies</Link>
        </li>
        </ul>
        <div style={containerStyle}>
          <div>
            <div>
              <label htmlFor="year">Select Year:</label>
              <input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2000"
                  max="2100"
                />
              </div>

            <BarChart year={year} />
          </div>
          <div>
          <div style={box}>
          <p>Sales Tax: ${salesTax}</p>
          </div>
          <div style={box}>
          <p>Shipping Total: ${shippingTotal}</p>
          </div>
          <div style={box}>
          <p>Total Gross Sales: ${totalSales}</p>
          </div>
          <div style={box}>
          <p>Total Net Sales: ${totalSpent}</p>
          </div>
        </div>
        </div>
        <p>Upload CSV file</p>
        <input type="file" id="file" name="file" accept=".csv" />
        <button onClick={handleFileUpload}>Update Dashboard</button>
      </div>
      </Layout>
    );
  };
  
  export default DashboardPage;
  