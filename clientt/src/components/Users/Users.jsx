import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { api } from "../../api/api";
import UserDetails from "./UserDetails";
import "./Users.css";

const Loading = () => (
  <div className="video-list-container spinner-container">
    <div className="spinner"></div>
  </div>
);

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");
    try {
      const { role } = jwtDecode(token);
      if (role !== "admin") return navigate("/unauthorized");
      fetchUsers();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/users/list");
      const regularUsers = res.data?.data?.filter(u => u.role === "user") || [];
      setUsers(regularUsers);
    } catch (err) {
      setError(err.response?.data?.message || "Չհաջողվեց բեռնել տվյալները");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleUser = async (userId) => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/user/${userId}`);
      setSelectedUser(res.data?.data);
    } catch (err) {
      setError("Չհաջողվեց ստանալ ուսանողի տվյալները");
    } finally {
      setLoading(false);
    }
  };

const filteredUsers = useMemo(() => {
  const term = search.toLowerCase().trim();

  return users.filter((u) => {
    const fullName = `${u.name} ${u.surname}`.toLowerCase();
    const faculty = u.faculty?.toLowerCase() || "";
    const course = String(u.course || "").toLowerCase();

    return (
      fullName.includes(term) ||
      faculty.includes(term) ||
      course.includes(term)
    );
  });
}, [search, users]);

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  // View Switcher
  if (selectedUser) {
    return <UserDetails user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="users-container">
      <h2 className="title">Ուսանողներ</h2>
      <input
        type="text"
        placeholder="Փնտրել անունով կամ ազգանունով..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="users-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user._id} className="user-card" onClick={() => fetchSingleUser(user._id)}>
              <div className="user-name">{user.name} {user.surname}</div>
              <div className="user-email">{user.email}</div>
            </div>
          ))
        ) : (
          <div className="no-users">Ուսանող չի գտնվել։</div>
        )}
      </div>
    </div>
  );
}

export default Users;