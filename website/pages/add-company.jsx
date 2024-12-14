// components/AddProductForm.js
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '0 auto',
    backgroundColor: '#fff',
  };
  
  const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };
  
  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  };
  
  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };
  
  const successStyle = {
    color: 'green',
    marginBottom: '10px',
  };
  import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
  
  export default function AddCompanyForm() {
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
  
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Input validation
      if (!companyName) {
        setError('All fields are required');
        return;
      }
  
      setLoading(true);
      setError(null);
      setSuccess(false);
  
      const companyData= {
        company_name: companyName,
      };
      console.log(companyData);
      try {
        const res = await fetch('/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(companyData),
        });
  
        const data = await res.json();
        if (!res.ok || res.status !== 200 || res.status !== 201) throw new Error('Failed to create company');
        console.log(res)
        console.log(data)
        setSuccess(true); // Indicate successful product creation
        setCompanyName('');
        alert('Company added successfully');
      } catch (err) {
        setError(err.message); // Handle errors (e.g., network or validation errors)
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Layout>
        <h2 style={{textAlign:'center', paddingTop: '50px'}}>Add Company</h2>
        
        {success && <p style={{ color: 'green' }}>Company added successfully!</p>}
  
        <form style={formStyle} onSubmit={handleSubmit}>
          <div >
            <label htmlFor="companyName">Company Name:</label>
            <input style={inputStyle}
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
  
  
          <button style={buttonStyle} type="submit" disabled={loading}>
            {loading ? 'Adding Company...' : 'Add Company'}
          </button>
        </form>
      </Layout>
    );
  }
  