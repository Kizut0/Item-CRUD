import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/user";
const USERS_PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadUsers(p = 1) {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?page=${p}&limit=${USERS_PER_PAGE}`);
      const json = await res.json();
      setUsers(json.data || []);
      setPage(json.page || p);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.log("==> err : ", err);
      alert("Loading users failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteUser(id, username) {
    if (!window.confirm(`Delete user \"${username}\"?`)) return;
    try {
      const result = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const json = await result.json().catch(() => ({}));
      if (!result.ok) {
        alert(json?.message || "Failed to delete user");
        return;
      }
      const shouldGoBack = users.length === 1 && page > 1;
      const nextPage = shouldGoBack ? page - 1 : page;
      loadUsers(nextPage);
    } catch (err) {
      console.log("==> err : ", err);
      alert("Error deleting user");
    }
  }

  useEffect(() => {
    loadUsers(1);
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>User Management</h1>
          <p className="muted">
            Page {page} of {totalPages} | Showing {users.length} user(s)
          </p>
        </div>
        <div className="right">
          <span className="pill">Read / Update / Delete</span>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="mono">{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {(user.firstname ?? "") + " " + (user.lastname ?? "")}
                  </td>
                  <td>
                    <span
                      className={`status ${String(user.status || "").toLowerCase()}`}
                    >
                      {user.status || "unknown"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/users/${user._id}`}>Edit</Link>
                    <button
                      className="ghost danger"
                      onClick={() => onDeleteUser(user._id, user.username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => loadUsers(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page <b>{page}</b> / {totalPages}
        </span>
        <button onClick={() => loadUsers(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
