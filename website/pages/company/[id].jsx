import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { FormContainer, FormGroup, Button, DeleteButton } from '../../components/styleDivs';

const CompanyPage = ({ company }) => {
    const router = useRouter();
    const { id } = router.query; // Dynamic parameter from the URL

    const handleDelete = async () => {
        try {
            console.log('Deleting company:', id);
            const res = await fetch(`/api/companies`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            alert('Company deleted');
            router.push('/company/company-links'); // Redirect to companies list after deletion
        } catch (error) {
            alert('An error occurred. Please try again.');
            console.error('Error deleting company:', error);
        }
    };

    if (router.isFallback) {
        return <FormGroup>Loading...</FormGroup>; // Show loading when it's being generated
    }

    // Display the company details if the company data is available
    if (!company) {
        return <FormGroup>Company not found</FormGroup>;
    }

    return (
        <Layout>
            <FormContainer>
                <FormGroup>
                    <h1>{company.company_name}</h1>
                    <p>ID: {company.id}</p>
                </FormGroup>
                <DeleteButton type="button" onClick={handleDelete}>Delete Company</DeleteButton>
            </FormContainer>
        </Layout>
    );
};

// This function will run server-side to fetch company data based on the `id`
export async function getServerSideProps({ params }) {
    const { id } = params;

    try {
        // Fetch data from your PostgreSQL database (example using @vercel/postgres)
        const { rows } = await fetchCompanyById(id);

        // If no company is found, return a 404 response
        if (rows.length === 0) {
            return { notFound: true };
        }

        // Pass the company data to the page component as props
        return {
            props: {
                company: rows[0],
            },
        };
    } catch (error) {
        console.error('Error fetching company:', error);
        return { props: { company: null } }; // Return null if there's an error
    }
}

// Example of fetching company data by `id` using Vercel's PostgreSQL client
async function fetchCompanyById(id) {
    const { sql } = require('@vercel/postgres');
    
    // SQL query to fetch the company details by ID
    const res = await sql`
        SELECT id, company_name
        FROM companies
        WHERE id = ${id}
    `;
    
    return res;
}

export default CompanyPage;