import { useSession } from "next-auth/react"
import { useState } from 'react';
import Layout from "../components/Layout";
import { FormContainer, FormGroup, Label, Input, ProductList, ProductItem, DeleteButton } from "../components/styleDivs";

export default function Email() {
//   const { data } = useSession()'
  const [receipts, setReceipts] = useState([]);
  const { data: session } = useSession();
  let accessToken;
  
  if (session) {
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