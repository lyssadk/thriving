import {useState, useEffect} from 'react';
import Layout from '../components/Layout';

// export default function CreateReceiptForm() {
//     const products = [];
//     const [salesTax, setSalesTax] = useState(0);
//     const [total, settotal] = useState(0);
//     const [state, setState] = useState('');
//     const [orderNumber, setOrderNumber] = useState(0);
//     const [orderDate, setOrderDate] = useState('');
//     const [company, setCompany] = useState('');
//     const [companies, setCompanies] = useState([]);
//     const [product, setProduct] = useState({name: '', price: 0, wholesale: false, company});

//     function addProduct() {
//         products.push(product);
//     }

//     function submitReceipt() {
//         // send the receipt to the server

//     }
//     useEffect(() => {
//         const fetchCompanies = async () => {
//           try {
//             const res = await fetch('/api/companies'); // Assuming you have an API to fetch companies
//             if (!res.ok) throw new Error('Failed to fetch companies');
//             const data = await res.json();
//             const dataList = data.rows.map((company) => ({
//               id: company.id,
//               company_name: company.company_name,
//             }));
//             console.log(dataList);
//             setCompanies(dataList);
//           } catch (err) {
//             setError(err.message);
//           }
//         };
    
//         fetchCompanies();
//       }, []);


//     return (
//       <Layout>
//         <div>
//             <h1>Create a receipt</h1>
//             <>
//               <form>
//                 <label>Company:</label>
//                 <select name="company">
//                     {companies.map((company) => (
//                         <option value={company.id}>{company.company_name}</option>
//                     ))}
//                 </select>
             
//                 <label>Product Name:</label>
//                 <input type="text" name="name" />
//                 <label>Product Price:</label>
//                 <input type="number" name="price" />
//                 <label>Wholesale:</label>
//                 <input type="checkbox" name="wholesale" />
//                 <button>Add Product</button>
                
//                 <label>Sales Tax:</label>
//                 <input type="number" name="salesTax" />
//                 <label>Shipping Total:</label>
//                 <input type="number" name="total" />
//                 <label>State:</label>
//                 <input type="text" name="state" />
//                 <label>Order Number:</label>
//                 <input type="number" name="orderNumber" />
//                 <label>Order Date:</label>
//                 <input type="date" name="orderDate" />
//                 <button type="submit">Submit Receipt</button>
                
//               </form>
//             </>
//         </div>
//       </Layout>
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

    const Select = styled.select`
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

    export default function CreateReceiptForm() {
      const [products, setProducts] = useState([]);
      const [salesTax, setSalesTax] = useState(0);
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

      async function submitReceipt() {
        try {
          console.log(products);
          const res = await fetch('/api/Receipts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderNumber,
              company,
              products,
              salesTax,
              total,
              state,
              orderDate,
            }),
          });
          if (!res.ok) throw new Error('Failed to submit receipt');
          alert('Receipt submitted successfully');
        } catch (err) {
          alert(err.message);
        }
      }

      useEffect(() => {
        const fetchCompanies = async () => {
          try {
            const res = await fetch('/api/companies');
            if (!res.ok) throw new Error('Failed to fetch companies');
            const data = await res.json();
            const dataList = data.rows.map((company) => ({
              id: company.id,
              company_name: company.company_name,
            }));
            setCompanies(dataList);
          } catch (err) {
            setError(err.message);
          }
        };

        fetchCompanies();
      }, []);

      return (
        <Layout>
          <FormContainer>
            <h1>Create a receipt</h1>
            <form onSubmit={(e) => { e.preventDefault(); submitReceipt(); }}>
              <FormGroup>
                <Label>Company:</Label>
                <Select name="company" value={company} onChange={(e) => setCompany(e.target.value)}>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.company_name}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Product Name:</Label>
                <Input type="text" name="name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label>Product Price:</Label>
                <Input type="number" name="price" value={product.price} onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })} />
              </FormGroup>
              <FormGroup>
                <Label>Wholesale:</Label>
                <Input type="checkbox" name="wholesale" checked={product.wholesale} onChange={(e) => setProduct({ ...product, wholesale: e.target.checked })} />
              </FormGroup>
              <Button type="button" onClick={addProduct}>Add Product</Button>
              <FormGroup>
                <Label>Sales Tax:</Label>
                <Input type="number" name="salesTax" value={salesTax} onChange={(e) => setSalesTax(parseFloat(e.target.value))} />
              </FormGroup>
              <FormGroup>
                <Label>Shipping Total:</Label>
                <Input type="number" name="total" value={total} onChange={(e) => setTotal(parseFloat(e.target.value))} />
              </FormGroup>
              <FormGroup>
                <Label>State:</Label>
                <Input type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label>Order Number:</Label>
                <Input type="number" name="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(parseInt(e.target.value))} />
              </FormGroup>
              <FormGroup>
                <Label>Order Date:</Label>
                <Input type="date" name="orderDate" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
              </FormGroup>
              <Button type="submit">Submit Receipt</Button>
            </form>
            <h2>Products</h2>
            <ProductList>
              {products.map((product, index) => (
                <ProductItem key={index}>
                  <span>{product.name} - ${product.price.toFixed(2)} {product.wholesale ? '(Wholesale)' : ''}</span>
                  <DeleteButton onClick={() => deleteProduct(index)}>Delete</DeleteButton>
                </ProductItem>
              ))}
            </ProductList>
          </FormContainer>
        </Layout>
      );
    }
