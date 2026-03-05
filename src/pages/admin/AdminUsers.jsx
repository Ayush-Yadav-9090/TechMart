import { useEffect, useState } from "react";
import { adminAPI, handleApiError } from "../../services/api";
import "../../Styles/AdminUsers.css"

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getAllUsers();
        setUsers(res.data.results || res.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-table">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td data-label="ID">{u.id}</td>
              <td data-label="Email">{u.email}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
