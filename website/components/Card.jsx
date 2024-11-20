import React from 'react';
export default function Card( {title, content} ) {
    return (
        <div style={{boxShadow:'2px 10px grey', padding: '20px', width:"150px"}}>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    )
}