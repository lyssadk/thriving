import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';

const ProductPage = ({ product }) => {
  const router = useRouter();
  const { id } = router.query; // Dynamic parameter from the URL
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    price: product.price,
    company_id: product.company_id, // Add company to the form data
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/Products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedProduct = await res.json();
      console.log('Product updated:', updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/Products`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: formData.id }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      console.log('Product deleted');
      router.push('/inventory'); // Redirect to products list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>; // Show loading when it's being generated
  }

  // Display the product details if the product data is available
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout>
      <form>
        <input type="hidden" name="id" value={formData.id} />
        <input type="hidden" name="company" value={formData.company_id} /> {/* Hidden field for company */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleEdit}>Edit Product</button>
        <button type="button" onClick={handleDelete}>Delete Product</button>
      </form>
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
    SELECT id, name, price, company_id, image
    FROM products
    WHERE id = ${id}
  `;
  
  return res;
}

export default ProductPage;
