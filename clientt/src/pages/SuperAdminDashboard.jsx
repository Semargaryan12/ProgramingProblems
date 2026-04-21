import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import AdminForm from '../components/SuperAdmin/AdminForm';
import DataTable from '../components/SuperAdmin/DataTable';
import Notification from '../components/SuperAdmin/Notification';
import '../styles/SuperAdmin.css';

/* ── Stat card ───────────────────────────────────────── */
const StatCard = ({ label, value, icon, accent }) => (
  <div className={`sa-stat-card sa-stat-card--${accent}`}>
    <span className={`sa-stat-icon sa-stat-icon--${accent}`}>{icon}</span>
    <div>
      <span className="sa-stat-value">{value}</span>
      <span className="sa-stat-label">{label}</span>
    </div>
  </div>
);

/* ── Icons ───────────────────────────────────────────── */
const IconAdmins = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

/* ── Dashboard ───────────────────────────────────────── */
const SuperAdminDashboard = () => {
  const [admins,         setAdmins]         = useState([]);
  const [users,          setUsers]          = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [message,        setMessage]        = useState({ type: '', text: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminRes, userRes] = await Promise.all([
        api.get('/super/admins'),
        api.get('/super/users'),
      ]);
      if (adminRes.data.success) setAdmins(adminRes.data.data);
      if (userRes.data.success)  setUsers(userRes.data.data);
    } catch {
      showNotification('error', 'Տվյալները բեռնելիս առաջացավ սխալ:');
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
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք հեռացնել այս հաշիվը:')) return;
    try {
      const res = await api.delete(`/super/${type}/${id}`);
      if (res.data.success) {
        showNotification('success', 'Հաշիվը հեռացվեց:');
        fetchData();
      }
    } catch {
      showNotification('error', 'Չհաջողվեց հեռացնել:');
    }
  };

  const handleEditRequest = (account) => {
    setEditingAccount(account);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sa-root">
      <Notification message={message} />

      {/* ── Page header ─────────────────────────────── */}
      <header className="sa-page-header">
        <div className="sa-page-header-left">
          <h1 className="sa-page-title">Կառավարման Վահանակ</h1>
          <p className="sa-page-sub">Կառավարիր ադմիններին և ուսանողներին</p>
        </div>

        <div className="sa-header-right">
          {/* Stat chips */}
          <StatCard label="Ադմիններ"  value={admins.length} icon={<IconAdmins />} accent="indigo" />
          <StatCard label="Ուսանողներ" value={users.length}  icon={<IconUsers />}  accent="blue"   />

          <button
            className="sa-refresh-btn"
            onClick={fetchData}
            disabled={loading}
            aria-label="Refresh data"
            title="Թարմացնել"
          >
            <span className={loading ? 'sa-spin' : ''}><IconRefresh /></span>
          </button>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────────── */}
      <div className="sa-layout">

        {/* Left: sticky form panel */}
        <aside className="sa-sidebar">
          <AdminForm
            editingAccount={editingAccount}
            onSuccess={() => { fetchData(); setEditingAccount(null); }}
            onCancel={() => setEditingAccount(null)}
            showNotification={showNotification}
          />
        </aside>

        {/* Right: tables */}
        <div className="sa-tables">
          <DataTable
            title="Ադմիններ"
            data={admins}
            onDelete={(id) => handleDelete(id, 'admin')}
            onEdit={handleEditRequest}
            loading={loading}
          />
          <DataTable
            title="Ուսանողներ"
            data={users}
            onDelete={(id) => handleDelete(id, 'user')}
            onEdit={handleEditRequest}
            loading={loading}
          />
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;