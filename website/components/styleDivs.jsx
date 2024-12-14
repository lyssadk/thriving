const FormContainer = ({ children }) => (
    <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
        {children}
    </div>
);

const FormGroup = ({ children }) => (
    <div style={{ marginBottom: '15px' }}>
        {children}
    </div>
);

const Label = ({ children }) => (
    <label style={{
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold'
    }}>
        {children}
    </label>
);

const Input = (props) => (
    <input style={{
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '4px'
    }} {...props} />
);

const Button = ({ children, ...props }) => (
    <button style={{
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }} {...props} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
        {children}
    </button>
);

const ProductList = ({ children }) => (
    <ul style={{ listStyleType: 'none', padding: '0' }}>
        {children}
    </ul>
);

const ProductItem = ({ children }) => (
    <li style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px'
    }}>
        {children}
    </li>
);

const DeleteButton = ({ children, ...props }) => (
    <button style={{
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }} {...props} onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'} onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}>
        {children}
    </button>
);

export { FormContainer, FormGroup, Label, Input, Button, ProductList, ProductItem, DeleteButton };