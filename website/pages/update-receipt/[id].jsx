import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
const { sql } = require('@vercel/postgres');
import { FormContainer, FormGroup, Label, Input, Button } from "../../components/styleDivs";



const UpdateReceiptPage = ({ receipt }) => {
    const router = useRouter();
    const { id } = router.query;
    console.log(receipt)
    const [formData, setFormData] = useState({
        company: receipt.company,
        salesTax: receipt.salestax,
        total: receipt.total,
        state: receipt.state,
        orderNumber: receipt.ordernumber,
        orderDate: receipt.orderdate,
        products: receipt.products || [],
        shipping: receipt.shipping,
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
            const res = await fetch(`/api/Receipts`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log(res)
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            alert('Receipt updated');
            router.push('/receipts'); 
        } catch (error) {
            console.error('Error updating receipt:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/Receipts`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderNumber: formData.orderNumber }),
            });
            console.log(res)
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            console.log('Receipt deleted');
            router.push('/receipts'); // Redirect to receipts list after deletion
        } catch (error) {
            console.error('Error deleting receipt:', error);
        }
    };

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!receipt) {
        return <div>Receipt not found</div>;
    }

    return (
        <Layout>
            <FormContainer>
                <form>
                    <FormGroup>
                        <Input
                            type="hidden"
                            name="company"
                            value={formData.company}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Sales Tax:</Label>
                        <Input
                            type="number"
                            name="salesTax"
                            value={formData.salesTax}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Shipping:</Label>
                        <Input
                            type="number"
                            name="shipping"
                            value={formData.shipping}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Total:</Label>
                        <Input
                            type="number"
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>State:</Label>
                        <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Order Number:</Label>
                        <Input
                            type="number"
                            name="orderNumber"
                            value={formData.orderNumber}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Order Date:</Label>
                        <Input
                            type="date"
                            name="orderDate"
                            value={formData.orderDate}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="hidden"
                            name="products"
                            value={JSON.stringify(formData.products)}
                        />
                    </FormGroup>
                    <Button type="button" onClick={handleEdit}>Edit Receipt</Button>
                    <Button type="button" onClick={handleDelete}>Delete Receipt</Button>
                </form>
            </FormContainer>
        </Layout>
    );
};

export async function getServerSideProps({ params }) {
    const { id } = params;

    try {
        const { rows } = await fetchReceiptById(id);
        console.log(rows)
        if (rows.length === 0) {
            return { notFound: true };
        }

        return {
            props: {
                receipt: {
                    ...rows[0],
                    orderdate: rows[0].orderdate.toISOString(),
                },
            },
        };
    } catch (error) {
        console.error('Error fetching receipt:', error);
        return { props: { receipt: null } };
    }
}

async function fetchReceiptById(id) {

    const res = await sql`
        SELECT company, salestax, total, state, ordernumber, orderdate, products, shipping
        FROM receipts
        WHERE ordernumber = ${id}
    `;
    return res;
}

export default UpdateReceiptPage;