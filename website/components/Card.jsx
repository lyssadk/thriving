import React from 'react';
import Image from 'next/image';
export default function Card( {title, content, img} ) {
    return (
        <div style={{boxShadow:'2px 10px 10px grey', padding: '20px', width:"150px", height:'200px', margin: '10px', borderRadius:'12px'}}>
            {img && <Image style={{margin:'0 auto'}} src={img} width={120} height={80} />}
            <h2>{title}</h2>
            <p>${content}</p>
        </div>
    )
}