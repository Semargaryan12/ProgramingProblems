import React from 'react';
import '../styles/AdminDashboard.css';  
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.role !== 'admin') {
      return <Navigate to="/login" />;
    }
  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <h1>Բարի գալուստ ադմինի էջ</h1>
        <p>Նավիգացիոն մենյուից ընտրեք համակարգը կառավարելու տարբերակ.</p>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
