// components/AddProductForm.js

import { useState, useEffect } from 'react';

export default function AddProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch the list of companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies'); // Assuming you have an API to fetch companies
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCompanies();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!name || !price || !companyId) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const productData = {
      name,
      price: parseFloat(price),
      company_id: parseInt(companyId),
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      setSuccess(true); // Indicate successful product creation
      setName('');
      setPrice('');
      setCompanyId('');
    } catch (err) {
      setError(err.message); // Handle errors (e.g., network or validation errors)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Product added successfully!</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="company">Company:</label>
          <select
            id="company"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
