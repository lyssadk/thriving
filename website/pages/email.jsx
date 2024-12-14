import { useSession } from "next-auth/react"
import { useState } from 'react';
import Layout from "../components/Layout";
import { FormContainer, FormGroup, Label, Input, ProductList, ProductItem, DeleteButton, Button } from "../components/styleDivs";

export default function Email() {
//   const { data } = useSession()'
  const [receipts, setReceipts] = useState([]);
  const { data: session } = useSession();
  let accessToken;
  
  if (session) {
    accessToken = session?.accessToken;
  }

  const [products, setProducts] = useState([]);
  const [salesTax, setSalesTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState('');
  const [orderNumber, setOrderNumber] = useState(0);
  const [orderDate, setOrderDate] = useState('');
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [product, setProduct] = useState({ name: '', price: 0, wholesale: false, company , quantity: 0});

  function addProduct() {
    setProducts([...products, product]);
    setProduct({ name: '', price: 0, wholesale: false, company, quantity: 0});
  }

  function deleteProduct(index) {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  }

  async function submitReceipt(receipt) {
    console.log(receipt);
    try {
      const res = await fetch('/api/Receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: receipt.orderNumber,
          company : receipt.company,
          products : receipt.products,
          salesTax : receipt.salesTax,
          total : receipt.total,
          state : receipt.state,
          orderDate : receipt.orderDate,
          shipping : receipt.shipping
        }),
      });
      if (!res.ok) throw new Error('Failed to submit receipt');
      alert('Receipt submitted successfully');
    } catch (err) {
      alert(err.message);
    }
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
                    <form onSubmit={(e) => { e.preventDefault(); console.log(receipt); submitReceipt(receipt); }}>
                        <FormGroup>
                            <Label>Receipt Company:</Label>
                            <Input type="text" value={receipt.company} />
                        </FormGroup>
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
                       <Button type="submit">Add Receipt</Button>
                    </form>
                </FormContainer>
            ))}

        </div>
        </Layout>
    );

}