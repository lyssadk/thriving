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
import Image from 'next/image';
import Layout from '../components/Layout';
import { redirect } from 'next/dist/server/api-utils';



export default function AddProductForm() {
  const [productPic, setProductPic] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState('');

  function convertToBase64(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setProductPic(reader.result);
          console.log("Reader: ", reader.result);
        }
        reader.onerror = () => {
          console.log("Error");
        }
      }
  }
  // Fetch the list of companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies'); // Assuming you have an API to fetch companies
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json();
        const dataList = data.rows.map((company) => ({
          id: company.id,
          company_name: company.company_name,
        }));
        console.log(dataList);
        setCompanies(dataList);
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
      image: productPic,
      quantity: parseInt(quantity),
    };
    console.log(productData);
    try {
      const res = await fetch('/api/Products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok || res.status !== 200 || res.status !== 201) {throw new Error('Failed to create product');}
      setSuccess(true); // Indicate successful product creation
      alert('Product added successfully!');
      redirect('/inventory');
    } catch (err) {
      setError(err.message); // Handle errors (e.g., network or validation errors)
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{textAlign:'center', paddingTop: '50px'}}>Add Product</h2>
      
      {success && <p style={{ color: 'green' }}>Product added successfully!</p>}

      <form style={formStyle} onSubmit={handleSubmit}>

      <div>
          <label htmlFor="productPic" className="block text-sm font-medium leading-6 text-gray-900 text-left">Profile Picture</label>
            <div className="mt-2 flex items-center">
              {productPic && (
                <Image src={productPic} alt="Profile Preview" width={100} height={50}/>
              )}
              <input 
                id="productPic" 
                name="productPic" 
                type="file" 
                onChange={convertToBase64}
                className="block w-full text-gray-900"
              />
            </div>
        </div>
        <div >
          <label htmlFor="name">Product Name:</label>
          <input style={inputStyle}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div >
          <label htmlFor="price">Price:</label>
          <input style={inputStyle}
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div >
          <label htmlFor="company">Company:</label>
          <select style={inputStyle}
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
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input style={inputStyle}
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
          />
        </div>

        <button style={buttonStyle} type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </Layout>
  );
}
