import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
// const products = [
//     {
//         title: 'Product 1',
//         content: 'This is the first product'
//     },
//     {
//         title: 'Product 2',
//         content: 'This is the second product'
//     },
//     {
//         title: 'Product 3',
//         content: 'This is the third product'
//     },
//     {
//         title: 'Product 4',
//         content: 'This is the fourth product'
//     },
//     {
//         title: 'Product 5',
//         content: 'This is the fifth product'
//     },
//     {
//         title: 'Product 6',
//         content: 'This is the sixth product'
//     },
//     {
//         title: 'Product 7',
//         content: 'This is the seventh product'
//     },
//     {
//         title: 'Product 8',
//         content: 'This is the eighth product'
//     },
//     {
//         title: 'Product 9',
//         content: 'This is the ninth product'
//     },
//     {
//         title: 'Product 10',
//         content: 'This is the tenth product'
//     },
// ]

export default function inventory() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    fetchProducts();
}, []);
    return (
        <div>
            <h1>Inventory</h1>
            <p>Welcome to the Inventory!</p>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {products.map((product, index) => (
                    <Card key={index} title={product.title} content={product.content} />
                ))}
            </div>
        </div>
    )
}