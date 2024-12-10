import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Receipts() {
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await axios.get('/api/Receipts');
                const receiptsList = response.data.rows.map((receipt) => ({
                    orderNumber: receipt.ordernumber,
                    orderDate: receipt.orderdate,
                    total: receipt.total,
                }));
                console.log(receiptsList);
                setReceipts(receiptsList);
            } catch (error) {
                console.error('Error fetching receipts:', error);
            }
        };

        fetchReceipts();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterDate = (e) => {
        setFilterDate(e.target.value);
    };

    const filteredResults = receipts.filter((receipt) => {
        return (
            (searchTerm === '' || receipt.orderNumber.includes(searchTerm)) &&
            (filterDate === '' || receipt.orderDate === filterDate)
        );
    });

    return (
        <Layout>
            <h1>Receipts</h1>
            <div>
                <label htmlFor="searchOrder">Search by Order Number:</label>
                <input
                    type="text"
                    id="searchOrder"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div>
                <label htmlFor="filterDate">Filter by Order Date:</label>
                <input
                    type="date"
                    id="filterDate"
                    value={filterDate}
                    onChange={handleFilterDate}
                />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {filteredResults.map((receipt) => (
                    <Link style={{color:'black', textDecoration:'none', boxShadow:'5px 5px 10px grey', borderRadius:'12px', padding:'20px', margin:'100px'}} href={`/edit-receipt/${receipt.ordernumber}`} key={receipt.orderNumber}>
                        <div className="receipt-card">
                            <h2>Order Number: {receipt.orderNumber}</h2>
                            <p>Order Date: {receipt.orderDate}</p>
                            <p>Total Amount: ${receipt.total}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </Layout>
    );
}