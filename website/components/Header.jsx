import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import LoginButton from "./login-btn"

export default function Header() {
    return (
        <nav>
            <ul>
                <li><Link href='/'>Landing Page</Link></li>
                <li><Link href='/inventory'>Inventory</Link></li>
                <li><Link href='/dashboard'>Dashboard</Link></li>
                 <LoginButton />
            </ul>
            <style jsx>{`
                nav {
                    margin:0;
                    padding: 1rem;
                    a{
                    text-decoration: none;
                    color:black;
                    }
                    ul {
                    list-style: none;
                    display: flex;
                    justify-content: space-around;
                    margin: 0;
                    padding: 0;
                    }
                    li {
                    padding: 0.5rem 1rem;
                    }
                    a:hover{
                    background-color: #f0f0f0;
                    }
                    a:visited {
                    color: black;
                    text-decoration: none;  
                    }
                }
            `}</style>
        </nav>
    )
}