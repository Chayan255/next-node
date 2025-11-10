"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (image) formData.append("image", image);

    await api.post("/products", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    alert("✅ Product added!");
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setPreview(null);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">🛍️ Manage Products</h1>

      <form
        onSubmit={addProduct}
        className="max-w-lg mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover mt-3 rounded" />
        )}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          ➕ Add Product
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
          >
           <img
  src={
    p.image_url?.startsWith("http")
      ? p.image_url
      : `http://localhost:5000${p.image_url}`
  }
  alt={p.name}
  className="w-full h-40 object-cover rounded"
/>

            <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
             ₹{Number(p.price).toFixed(2)}

            </p>
            <button
              onClick={() => deleteProduct(p.id)}
              className="text-red-500 mt-3 hover:underline"
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
