export default function Header() {
    return (
        <nav>
            <ul>
                <a href='/add-product'><li>Add Product</li></a>
                <a href='/add-company'><li>Add Company</li></a>
                <a href='/inventory'><li>Inventory</li></a>
                <a href='/dashboard'><li>Dashboard</li></a>
            </ul>
            <style jsx>{`
                nav {
                    margin:0;
                    padding: 1rem;
                }
                ul {
                    list-style: none;
                    display: flex;
                    justify-content: space-around;
                    margin: 0;
                    padding: 0;
                }
                a {
                    text-decoration: none;
                    color:black;
                }
                li {
                    padding: 0.5rem 1rem;
                }
                a:hover li {
                    background-color: #f0f0f0;
                }
            `}</style>
        </nav>
    )
}