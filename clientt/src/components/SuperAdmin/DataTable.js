import React, { useState } from "react";

/* ── SVG Icons ───────────────────────────────────────── */
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconDelete = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const DataTable = ({ title, data, onDelete, onEdit, loading }) => {
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) =>
    `${item.name} ${item.surname} ${item.email} ${item.username || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="dt-card">
      <div className="dt-header">
        <div className="dt-title-wrap">
          <h3 className="dt-title">{title}</h3>
          <span className="dt-count">{filtered.length}</span>
        </div>
        <div className="dt-search-wrap">
          <IconSearch />
          <input
            type="search"
            placeholder="   Որոնել..."
            className="dt-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
        </div>
      </div>

      <div className="dt-body">
        {loading ? (
          <div className="dt-loading">
            <div className="dt-spinner" />
            <span>Բեռնվում է...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dt-empty">
            <p>{search ? "Ոչ մի արդյունք" : "Տվյալներ չկան"}</p>
          </div>
        ) : (
          <table className="dt-table">
            <thead>
              <tr>
                <th>Անուն / Ազգանուն</th>
                <th>Էլ. Հասցե</th>
                <th>Դեր</th>
                <th className="dt-th-actions">Գործողություն</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} className="dt-row">
                  <td>
                    <div className="dt-name">{item.name} {item.surname}</div>
                    {item.username && (
                      <div className="dt-username">@{item.username}</div>
                    )}
                  </td>
                  <td className="dt-email">{item.email}</td>
                  <td>
                    <span className={`dt-role-badge dt-role-badge--${item.role}`}>
                      {item.role === "admin" ? "Ադմին" : "Ուսանող"}
                    </span>
                  </td>
                  <td className="dt-actions">
                    <button
                      className="dt-action-btn dt-action-btn--edit"
                      title="Խմբագրել"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="dt-action-btn dt-action-btn--delete"
                      title="Հեռացնել"
                      onClick={() => onDelete(item._id)}
                      aria-label={`Delete ${item.name}`}
                    >
                      <IconDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default DataTable;