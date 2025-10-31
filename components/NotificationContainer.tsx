import React from 'react';
import { useNotification } from '../context/NotificationContext.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import type { Notification as NotificationType } from '../types.ts';


const Notification: React.FC<{ notification: NotificationType; onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
    const typeClasses = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    };

    return (
        <div
            className={`flex items-center justify-between max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden my-2 border-l-4 ${typeClasses[notification.type]}`}
        >
            <div className="p-4">
                <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="p-1">
                <button 
                    onClick={() => onDismiss(notification.id)} 
                    className={`p-1 rounded-md hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeClasses[notification.type].replace('bg-', 'hover:bg-')}`}
                    aria-label="Dismiss notification"
                >
                    <CloseIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div aria-live="assertive" className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-[200]">
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} onDismiss={removeNotification} />
            ))}
        </div>
    );
};

export default NotificationContainer;