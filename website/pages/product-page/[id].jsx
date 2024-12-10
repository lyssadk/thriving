
import Header from '../../components/Header';
import Card from '../../components/Card';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

const ProductPage = ({ product }) => {
  const router = useRouter();
  const { id } = router.query; // Dynamic parameter from the URL

  if (router.isFallback) {
    return <div>Loading...</div>; // Show loading when it's being generated
  }

  // Display the product details if the product data is available
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout>
        <h1>Product</h1>
        <p>Welcome to the Product!</p>
        <Card title={product.name} content={product.price}/>
        <button>Edit Product</button>
        <button>Delete Product</button>
      </Layout>
  );
};

// This function will run server-side to fetch product data based on the `id`
export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    // Fetch data from your PostgreSQL database (example using @vercel/postgres)
    const { rows } = await fetchProductById(id);

    // If no product is found, return a 404 response
    if (rows.length === 0) {
      return { notFound: true };
    }

    // Pass the product data to the page component as props
    return {
      props: {
        product: rows[0],
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { props: { product: null } }; // Return null if there's an error
  }
}

// Example of fetching product data by `id` using Vercel's PostgreSQL client
async function fetchProductById(id) {
  const { sql } = require('@vercel/postgres');
  
  // SQL query to fetch the product details by ID
  const res = await sql`
    SELECT id, name, price, image
    FROM products
    WHERE id = ${id}
  `;
  
  return res;
}

export default ProductPage;

// export default function Product() {
//     const [product, setProduct] = useState({});
//     // grab the id from the parameter
//     const router = useRouter();
//     const { id } = router.query;
//     console.log(id);
//     // fetch the product with the id, use a useEffect hook
    
   
//     useEffect(() => { 
//         if (!id) return;
//         const fetchProduct = async () => {
//             try {
//                 const res = await fetch(`/api/Products/${id}`);
//                 if (!res.ok) {
//                     throw new Error(`HTTP error! status: ${res.status}`);
//                 }
//                 const productResult = await res.json();
//                 setProduct(productResult);
//                 console.log(productResult);
//             } catch (error) {
//                 console.error('Error fetching product:', error);
//             }
//         }
//         fetchProduct();
//     }, [id])
//     return (
//         <div>
//             <Header/>
//             <h1>Product</h1>
//             <p>Welcome to the Product!</p>
//             <Card title={product.name} content={product.price}/>
//         </div>
//     )
// }
