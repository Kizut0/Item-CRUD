import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/api/user";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          username: data.username ?? "",
          email: data.email ?? "",
          firstname: data.firstname ?? "",
          lastname: data.lastname ?? "",
          status: data.status ?? "ACTIVE",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      username: form.username.trim(),
      email: form.email.trim(),
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      status: form.status,
    };

    if (!body.username || !body.email || !body.firstname || !body.lastname) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(json?.message || "Update failed");
      return;
    }

    alert("Updated successfully");
    navigate("/users");
  }

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Edit User</h1>
          <p className="muted">User ID: {id}</p>
        </div>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="username"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
            />
          </label>

          <div className="row">
            <label>
              First name
              <input
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                placeholder="First name"
              />
            </label>
            <label>
              Last name
              <input
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                placeholder="Last name"
              />
            </label>
          </div>

          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <div className="actions-row">
            <button type="submit">Update User</button>
            <Link to="/users" className="ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
