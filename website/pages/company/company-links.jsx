import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';


export default function CompanyLinks(){
    const [companies, setCompanies] = useState([]);
    // get companies from the API   
    useEffect(() => {
        fetch('/api/companies')
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setCompanies(data.rows);
        });
    }
    , []);

    return (
        <Layout>
            <h1 style={{ fontSize: '2em', marginBottom: '20px', color: '#333', textAlign: 'center'}}>Companies</h1>
            <p style={{ textAlign: 'center' }}>Click on a company to view details </p>
            <ul style={{ listStyleType: 'none', padding: '10px', textAlign:'center', boxShadow:'2px 2px 10px gray', width:'40%', margin:'0 auto'}}>
                {companies.map((company) => (
                    <li key={company.id} style={{ margin: '10px 0' }}>
                        <Link href={`/company/${company.id}`} style={{ textDecoration: 'none', color: '#0070f3', fontSize: '1.2em' }}>
                                {company.company_name}
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}