import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    async function loadUsers() {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/user`, {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json().catch(() => []);
            if (!res.ok) throw new Error(data?.message || `Load failed (${res.status})`);

            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("loadUsers error:", err);
            alert("Loading users failed");
        } finally {
            setLoading(false);
        }
    }

    function updateLocalField(userId, field, value) {
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, [field]: value } : u))
        );
    }

    async function onSave(user) {
        try {
            const body = {
                fullName: user.fullName ?? "",
                email: user.email ?? "",
                role: user.role ?? "user",
                status: user.status ?? "ACTIVE",
            };

            const res = await fetch(`${API_BASE}/api/user/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || `Update failed (${res.status})`);

            alert("Updated!");
            loadUsers();
        } catch (err) {
            console.log("onSave error:", err);
            alert("Update failed");
        }
    }

    async function onDelete(userId) {
        const ok = confirm("Delete this user?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_BASE}/api/user/${userId}`, {
                method: "DELETE",
                cache: "no-store",
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || `Delete failed (${res.status})`);

            alert("Deleted!");
            loadUsers();
        } catch (err) {
            console.log("onDelete error:", err);
            alert("Delete failed");
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h2>User Management</h2>

            <button onClick={loadUsers} disabled={loading} style={{ marginBottom: 12 }}>
                {loading ? "Loading..." : "Reload"}
            </button>

            <table
                border="1"
                cellPadding="8"
                style={{ width: "100%", borderCollapse: "collapse" }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>ID</th>
                        <th style={{ textAlign: "left" }}>Full Name</th>
                        <th style={{ textAlign: "left" }}>Email</th>
                        <th style={{ textAlign: "left" }}>Role</th>
                        <th style={{ textAlign: "left" }}>Status</th>
                        <th style={{ textAlign: "left" }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u._id}</td>

                            <td>
                                <input
                                    value={u.fullName ?? ""}
                                    onChange={(e) => updateLocalField(u._id, "fullName", e.target.value)}
                                />
                            </td>

                            <td>
                                <input
                                    value={u.email ?? ""}
                                    onChange={(e) => updateLocalField(u._id, "email", e.target.value)}
                                />
                            </td>

                            <td>
                                <select
                                    value={u.role ?? "user"}
                                    onChange={(e) => updateLocalField(u._id, "role", e.target.value)}
                                >
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                    <option value="staff">staff</option>
                                </select>
                            </td>

                            <td>
                                <select
                                    value={u.status ?? "ACTIVE"}
                                    onChange={(e) => updateLocalField(u._id, "status", e.target.value)}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </td>

                            <td style={{ display: "flex", gap: 8 }}>
                                <button type="button" onClick={() => onSave(u)}>
                                    Save
                                </button>
                                <button type="button" onClick={() => onDelete(u._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {users.length === 0 && !loading && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}