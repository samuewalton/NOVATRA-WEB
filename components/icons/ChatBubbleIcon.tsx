
import React from 'react';

const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.288a2.25 2.25 0 0 0-.659-1.591l-2.097-2.097c-.074-.074-.074-.196 0-.27l4.155-4.155a.75.75 0 0 1 1.06 0l2.097 2.097a2.25 2.25 0 0 0 1.591.659h2.288c.491 0 .97.04 1.425.09a4.48 4.48 0 0 0 2.025.978 5.969 5.969 0 0 1 .065.474c.18.832.337 1.698.337 2.555Z" />
    </svg>
);

export default ChatBubbleIcon;
