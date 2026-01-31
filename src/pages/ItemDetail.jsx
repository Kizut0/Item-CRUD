import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../config";

export function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const nameRef = useRef(null);
    const categoryRef = useRef(null);
    const priceRef = useRef(null);
    const statusRef = useRef(null);

    const [loading, setLoading] = useState(false);

    async function loadItem() {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/item/${id}`, { cache: "no-store" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Load failed");

            if (nameRef.current) nameRef.current.value = data.itemName ?? "";
            if (categoryRef.current) categoryRef.current.value = data.itemCategory ?? "Stationary";
            if (priceRef.current) priceRef.current.value = data.itemPrice ?? "";
            if (statusRef.current) statusRef.current.value = data.status ?? "ACTIVE";
        } catch (e) {
            console.log("loadItem error:", e);
            alert("Loading item failed");
        } finally {
            setLoading(false);
        }
    }

    async function onUpdate() {
        const itemName = nameRef.current?.value?.trim();
        const itemCategory = categoryRef.current?.value?.trim();
        const itemPrice = priceRef.current?.value?.trim();
        const status = statusRef.current?.value?.trim();

        if (!itemName) return alert("Please enter itemName.");
        if (!itemCategory) return alert("Please select itemCategory.");
        if (!itemPrice || Number.isNaN(Number(itemPrice))) return alert("Please enter valid itemPrice.");

        try {
            const res = await fetch(`${API_BASE}/api/item/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemName, itemCategory, itemPrice, status }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Update failed");

            alert("Updated!");
            loadItem();
        } catch (e) {
            console.log("update error:", e);
            alert("Update failed");
        }
    }

    useEffect(() => {
        loadItem();
    }, [id]);

    return (
        <div>
            <button onClick={() => navigate(-1)}>← Back</button>
            <h3>Edit Item</h3>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table cellPadding="8">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td><input ref={nameRef} /></td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>
                                <select ref={categoryRef} defaultValue="Stationary">
                                    <option>Stationary</option>
                                    <option>Kitchenware</option>
                                    <option>Appliance</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td><input ref={priceRef} /></td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>
                                <select ref={statusRef} defaultValue="ACTIVE">
                                    <option>ACTIVE</option>
                                    <option>INACTIVE</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            <hr />
            <button onClick={onUpdate}>Update</button>
        </div>
    );
}