import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react';
import Layout from "../components/Layout";
import styled from 'styled-components';
const FormContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const ProductList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ProductItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
`;

const DeleteButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #c82333;
    }
`;

export default function Email() {
//   const { data } = useSession()'
  const [receipts, setReceipts] = useState([]);
  const { data: session } = useSession();
  let accessToken;
  
  if (session) {
    console.log("Access Token:", session.accessToken);
    accessToken = session?.accessToken;
  }


  // fetch the emails from the server
    const fetchEmails = async () => {
        const res = await fetch('/api/scrapeEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
        });
        const data = await res.json();
        console.log(data);
        // once the data is received display it on the page in a form for a user to select the receipt they want to add
        
        setReceipts(data);
    };
   
    return (
        <Layout>
        <div>

            <h1>Email</h1>
           {session && <button onClick={fetchEmails}>Fetch Emails</button>}

            {receipts.map((receipt, index) => (
                <FormContainer key={index}>
                    <form>
                        <FormGroup>
                            <Label>Receipt Total:</Label>
                            <Input type="number" value={receipt.total} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Receipt Date:</Label>
                            <Input type="date" value={receipt.orderDate} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Receipt Shipping:</Label>
                            <Input type="number" value={receipt.shipping} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Receipt Tax:</Label>
                            <Input type="number" value={receipt.salesTax} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Receipt State:</Label>
                            <Input type="text" value={receipt.state} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Receipt Order Number:</Label>
                            <Input type="text" value={receipt.orderNumber} />
                        </FormGroup>
                        <ProductList>
                            {receipt.products.map((product, index) => (
                                <ProductItem key={index}>
                                    <div>
                                        <strong>{product.name}</strong> - {product.quantity} x ${product.price}
                                    </div>
                                    <DeleteButton>Delete</DeleteButton>
                                </ProductItem>
                            ))}
                        </ProductList>
                    </form>
                </FormContainer>
            ))}

        </div>
        </Layout>
    );

}