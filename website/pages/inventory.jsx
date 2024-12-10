import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function inventory() {
    const [products, setProducts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);   

    useEffect(() => {
    
    const fetchCompanies = async () => {
    try {
        const response = await axios.get('/api/companies');
        const companiesList = response.data.rows.map((company) => ({
            id: company.id,
            company_name: company.company_name,
        }));
        setCompanies(companiesList);
    } catch (error) {
        console.error('Error fetching companies:', error);
    }};const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/Products');
            const productsList = response.data.rows.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                company_id: product.company_id,
            }));
            console.log(productsList)
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    fetchCompanies();
    fetchProducts();
    
}, []);
    return (
        <Layout>
            <h1>Inventory</h1>
            <p>Welcome to the Inventory!</p>
            
            
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <div>
                <label htmlFor="companyFilter">Filter by Company:</label>
                <select
                    id="companyFilter"
                    onChange={(e) => {
                        const companyId = e.target.value;
                        if (!companyId) {
                           // If no company is selected, show all products
                            setFilteredProducts(null);
                        } 
                        else {
                            const filteredProducts = products.filter(
                                (product) => product.company_id === parseInt(companyId)
                            );
                            setFilteredProducts(filteredProducts);
                        }
                    }}
                >
                    <option value="">All Companies</option>
                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.company_name}
                        </option>
                    ))}
                </select>
            </div>
            { !filteredProducts && products.map((product) => (
                   <Link href={`/product-page/${product.id}`}><Card key={product.id} title={product.name} content={product.price} img={product.image} /></Link> ))}
            { filteredProducts && filteredProducts.map((product, index) => (
                    <Link href={`/product-page/${product.id}`}><Card key={index} title={product.name} content={product.price} img={product.image} /></Link>))}
            
            </div>
        </Layout>
    )
}