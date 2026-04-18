import React, { useState } from 'react';

const DataTable = ({ title, data, onDelete, onEdit, loading }) => {
    const [search, setSearch] = useState('');

    const filtered = data.filter(item => 
        `${item.name} ${item.surname} ${item.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="list-card card-shadow">
            <div className="list-header">
                <h3>{title}</h3>
                <input 
                    type="text" 
                    placeholder="Որոնում..." 
                    className="search-bar"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="table-wrapper">
                {loading ? <p>Բեռնվում է...</p> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Անուն Ազգանուն</th>
                                <th>Էլ. հասցե</th>
                                <th>Գործողություն</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map(item => (
                               // Inside your table body mapping:
<tr key={item._id}>
    <td>
        <div style={{fontWeight: '600'}}>{item.name} {item.surname}</div>
        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{item.faculty}</div>
    </td>
    <td className="email-cell">{item.email}</td>
    <td>
        <span className={`badge ${item.role}`}>
            {item.role === 'admin' ? 'Ադմին' : 'Ուսանող'}
        </span>
    </td>
    <td className="actions-cell">
        <button className="edit-btn" title="Խմբագրել" onClick={() => onEdit(item)}>✏️</button>
        <button className="delete-btn" title="Հեռացնել" onClick={() => onDelete(item._id)}>🗑️</button>
    </td>
</tr>
                            )) : <tr><td colSpan="3">Տվյալներ չկան:</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

export default DataTable;