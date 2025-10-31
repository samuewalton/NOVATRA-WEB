
import React from 'react';

const CartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.125-.821l2.853-5.706a.75.75 0 0 0-.01-1.022l-1.85-2.29a.75.75 0 0 0-.946-.245L6.5 9.75M7.5 14.25h11.218" />
    </svg>
);

export default CartIcon;
