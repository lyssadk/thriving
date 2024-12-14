import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function inventory() {
    const [products, setProducts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);   
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('card');

    const toggleViewMode = () => {
        setViewMode(viewMode === 'card' ? 'table' : 'card');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/Products');
            const productsList = response.data.rows ? response.data.rows.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                company_id: product.company_id,
                quantity: product.quantity
            })) : [];
            console.log(productsList)
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const fetchCompanies = async () => {
    try {
        console.log("Fetching companies")
        const response = await axios.get('/api/companies');
        console.log(response)
        const companiesList = response.data.rows ? response.data.rows.map((company) => ({
            id: company.id,
            company_name: company.company_name,
        })) : [];
        setCompanies(companiesList);
    } catch (error) {
        console.error('Error fetching companies:', error);
    }};

    fetchProducts();
    fetchCompanies();
}, []);
    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Inventory</h1>
                <p style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome to the Inventory!</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <button 
                        onClick={toggleViewMode} 
                        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Toggle to {viewMode === 'card' ? 'Table' : 'Card'} View
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ marginRight: '20px' }}>
                        <label htmlFor="companyFilter" style={{ marginRight: '10px' }}>Filter by Company:</label>
                        <select
                            id="companyFilter"
                            onChange={(e) => {
                                const companyId = e.target.value;
                                if (!companyId) {
                                    setFilteredProducts(null);
                                } else {
                                    const filteredProducts = products.filter(
                                        (product) => product.company_id === parseInt(companyId)
                                    );
                                    setFilteredProducts(filteredProducts);
                                }
                            }}
                            style={{ padding: '5px', borderRadius: '5px' }}
                        >
                            <option value="">All Companies</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.company_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="search" style={{ marginRight: '10px' }}>Search Products:</label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by product name"
                            style={{ padding: '5px', borderRadius: '5px' }}
                        />
                    </div>
                </div>
                {viewMode === 'card' ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin:'60px' }}>
                        {!filteredProducts &&
                            products.map((product) => (
                                <Link
                                    key={product.id}
                                    style={{ color: 'black', textDecoration: 'none', margin: '10px' }}
                                    href={`/product-page/${product.id}`}
                                >
                                    <Card
                                        title={product.name}
                                        content={`${product.price}`}
                                        img={product.image}
                                        quantity={product.quantity}
                                    />
                                </Link>
                            ))}
                        {filteredProducts &&
                            filteredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    style={{ color: 'black', textDecoration: 'none', margin: '10px' }}
                                    href={`/product-page/${product.id}`}
                                >
                                    <Card
                                        title={product.name}
                                        content={`${product.price}`}
                                        img={product.image}
                                        quantity={product.quantity}
                                    />
                                </Link>
                            ))}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!filteredProducts &&
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`$${product.price}`}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.quantity}</td>
                                    </tr>
                                ))}
                            {filteredProducts &&
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`$${product.price}`}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.quantity}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    )
}
