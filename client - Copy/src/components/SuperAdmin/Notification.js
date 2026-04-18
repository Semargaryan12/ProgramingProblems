import React from 'react';

const Notification = ({ message }) => {
    if (!message.text) return null;
    return (
        <div className={`notification-toast ${message.type}`}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
    );
};

export default Notification;