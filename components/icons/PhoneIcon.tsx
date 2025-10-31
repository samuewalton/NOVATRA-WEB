import React from 'react';

const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.211-.99-.554-1.35l-2.454-2.454a2.25 2.25 0 0 0-3.182 0l-1.99 1.99a11.192 11.192 0 0 1-7.052-7.052l1.99-1.99a2.25 2.25 0 0 0 0-3.182L6.75 3.554a2.25 2.25 0 0 0-1.35-.554H3.75a2.25 2.25 0 0 0-2.25 2.25Z" />
    </svg>
);

export default PhoneIcon;
