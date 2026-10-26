import React from 'react';

// type: 'error' | 'success' | 'info'
function StatusMessage({ type = 'info', children }) {
  return (
    <p className={`status-message status-message--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export default StatusMessage;
