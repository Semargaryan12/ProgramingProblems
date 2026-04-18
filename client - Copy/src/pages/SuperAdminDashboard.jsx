import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api/api';
import AdminForm from '../components/SuperAdmin/AdminForm';
import DataTable from '../components/SuperAdmin/DataTable';
import Notification from '../components/SuperAdmin/Notification';
import '../styles/SuperAdmin.css';

const SuperAdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingAccount, setEditingAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [adminRes, userRes] = await Promise.all([
                api.get('/super/admins'),
                api.get('/super/users')
            ]);
            if (adminRes.data.success) setAdmins(adminRes.data.data);
            if (userRes.data.success) setUsers(userRes.data.data);
        } catch (err) {
            showNotification('error', "Տվյալները բեռնելիս առաջացավ սխալ:");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Վստա՞հ եք, որ ցանկանում եք հեռացնել այս հաշիվը:`)) return;
        try {
            const res = await api.delete(`/super/${type}/${id}`);
            if (res.data.success) {
                showNotification('success', "Հեռացված է:");
                fetchData();
            }
        } catch (err) {
            showNotification('error', "Չհաջողվեց հեռացնել:");
        }
    };

    const handleEditRequest = (account) => {
        setEditingAccount(account);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="super-admin-layout">
            <Notification message={message} />

            <main className="sa-content">
                <header className="content-header">
                    <h1>Կառավարման Վահանակ</h1>
                    <div className="stats">
                        <span>Ադմիններ՝ {admins.length}</span> | <span>Օգտատերեր՝ {users.length}</span>
                    </div>
                </header>

                <div className="sa-grid-container">
                    <AdminForm 
                        editingAccount={editingAccount} 
                        onSuccess={() => { fetchData(); setEditingAccount(null); }}
                        onCancel={() => setEditingAccount(null)}
                        showNotification={showNotification}
                    />

                    <div className="lists-wrapper">
                        <DataTable 
                            title="📋 Ադմինիստրատորներ"
                            data={admins} 
                            onDelete={(id) => handleDelete(id, 'admin')}
                            onEdit={handleEditRequest}
                            loading={loading}
                        />
                        <DataTable 
                            title="👥 Օգտատերեր"
                            data={users} 
                            onDelete={(id) => handleDelete(id, 'user')}
                            onEdit={handleEditRequest}
                            loading={loading}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;