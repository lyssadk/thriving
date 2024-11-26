// pages/dashboard.js
import { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [salesTax, setSalesTax] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [shippingTotal, setShippingTotal] = useState(0);
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
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines or invalid rows
        if (!line) continue;
        
        const columns = line.split(','); // Split line by commas to get columns
        let newtax = 0;
       
        const tax = columns[8]?.trim();  
        if (tax && tax.startsWith('$')) {
          newtax = tax.replace('$', '');  // Remove the dollar sign
        }
        // If tax is a valid number, add it to salesTax
        if (!isNaN(parseFloat(newtax))) {
          salesTax += parseFloat(newtax);
        } else {
          console.log(tax)
          console.warn(`Skipping invalid tax value at line ${i + 1}`);
        }
      }
  
      // Update the dashboard with the total sales tax
      setSalesTax(salesTax.toFixed(2));
    };
  
    reader.readAsText(csvFile); // Read the CSV file as text
  }


    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the Dashboard!</p>
        <div>
          <p>Sales Tax:${salesTax}</p>
        </div>
        <div>
          <p>Shipping Total:${shippingTotal}</p>
        </div>
        <div>
          <p></p>
        </div>
      
        <p>Upload CSV file</p>
      <input type="file" id="file" name="file" accept=".csv"/>
      <button onClick={handleFileUpload}>Update Dashboard</button>
      </div>

    );
  };
  
  export default DashboardPage;
  