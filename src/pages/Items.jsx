import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export function Items() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const nameRef = useRef(null);
    const categoryRef = useRef(null);
    const priceRef = useRef(null);
    const statusRef = useRef(null);

    async function loadItems(nextPage = page) {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/item?page=${nextPage}&limit=${limit}`, {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || `Load failed (${res.status})`);

            setItems(Array.isArray(data.items) ? data.items : []);
            setPage(data.page || nextPage);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.log("loadItems error:", err);
            alert("Loading items failed");
        } finally {
            setLoading(false);
        }
    }

    async function onAdd() {
        const itemName = nameRef.current?.value?.trim();
        const itemCategory = categoryRef.current?.value?.trim();
        const itemPrice = priceRef.current?.value?.trim();
        const status = statusRef.current?.value?.trim();

        if (!itemName) return alert("Please enter itemName.");
        if (!itemCategory) return alert("Please select itemCategory.");
        if (!itemPrice || Number.isNaN(Number(itemPrice))) return alert("Please enter valid itemPrice.");

        try {
            const res = await fetch(`${API_BASE}/api/item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemName, itemCategory, itemPrice, status }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Create failed");

            if (nameRef.current) nameRef.current.value = "";
            if (priceRef.current) priceRef.current.value = "";

            loadItems(1);
        } catch (err) {
            console.log("onAdd error:", err);
            alert("Add item failed");
        }
    }

    async function onDelete(itemId) {
        const ok = confirm("Delete this item?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_BASE}/api/item/${itemId}`, {
                method: "DELETE",
                cache: "no-store",
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Delete failed");

            loadItems(page);
        } catch (err) {
            console.log("onDelete error:", err);
            alert("Delete failed");
        }
    }

    useEffect(() => {
        loadItems(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2>Item CRUD</h2>

            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                <button disabled={loading || page <= 1} onClick={() => loadItems(page - 1)}>
                    ◀ Prev
                </button>
                <span>
                    Page {page} / {totalPages}
                </span>
                <button disabled={loading || page >= totalPages} onClick={() => loadItems(page + 1)}>
                    Next ▶
                </button>

                <button onClick={() => loadItems(page)} disabled={loading}>
                    {loading ? "Loading..." : "Reload"}
                </button>
            </div>

            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>itemName</th>
                        <th>itemCategory</th>
                        <th>itemPrice</th>
                        <th>status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((it) => (
                        <tr key={it._id}>
                            <td>{it._id}</td>
                            <td>{it.itemName}</td>
                            <td>{it.itemCategory}</td>
                            <td>{it.itemPrice}</td>
                            <td>{it.status}</td>
                            <td style={{ display: "flex", gap: 10 }}>
                                <button type="button" onClick={() => navigate(`/items/${it._id}`)}>
                                    Edit
                                </button>
                                <button type="button" onClick={() => onDelete(it._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Add new item row */}
                    <tr>
                        <td>-</td>
                        <td>
                            <input ref={nameRef} placeholder="Item name" />
                        </td>
                        <td>
                            <select ref={categoryRef} defaultValue="Stationary">
                                <option>Stationary</option>
                                <option>Kitchenware</option>
                                <option>Appliance</option>
                            </select>
                        </td>
                        <td>
                            <input ref={priceRef} placeholder="10.99" />
                        </td>
                        <td>
                            <select ref={statusRef} defaultValue="ACTIVE">
                                <option>ACTIVE</option>
                                <option>INACTIVE</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={onAdd}>Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}