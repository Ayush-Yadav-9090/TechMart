
import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";
import "../../Styles/Admin.css";

const CATEGORY_SUGGESTIONS = [
  "Electronics",
  "Headphones",
  "Smartphones",
  "Storage",
  "RAM",
  "Accessories",
];

const BRAND_SUGGESTIONS = [
  "Apple",
  "Samsung",
  "Sony",
  "Bose",
  "Corsair",
  "Kingston",
  "Western Digital",
];

const AdminProducts = ({ products, setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
    sku: "",
    main_image: null,
    images: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminAPI.getAllProducts();
      setProducts(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category || !newProduct.brand) {
        setError("Name, Category and Brand are required");
        return;
      }

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", Number(newProduct.price));
      formData.append("stock", Number(newProduct.stock));
      formData.append("description", newProduct.description);
      formData.append("category", newProduct.category);
      formData.append("brand", newProduct.brand);
      
      formData.append("is_active", true);
      formData.append("is_best_seller", true);

      if (newProduct.sku) formData.append("sku", newProduct.sku);
      if (newProduct.main_image) formData.append("main_image", newProduct.main_image);
      if (newProduct.images.length > 0)
        Array.from(newProduct.images).forEach((file) => formData.append("images[]", file));

      await adminAPI.createProduct(formData);
      fetchProducts();
      setError("");
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        description: "",
        sku: "",
        main_image: null,
        images: [],
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Product creation failed");
    }
  };

  const handleRemove = async (id) => {
    try {
      await adminAPI.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="admin-products">
      <h1>Products</h1>

      <div className="add-product-form">
        {error && <p className="error">{error}</p>}

        <input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <input
          placeholder="SKU (optional)"
          value={newProduct.sku}
          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
        />

        {/* CATEGORY INPUT */}
        <input
          list="category-list"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <datalist id="category-list">
          {CATEGORY_SUGGESTIONS.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>

        {/* BRAND INPUT */}
        <input
          list="brand-list"
          placeholder="Brand"
          value={newProduct.brand}
          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
        />
        <datalist id="brand-list">
          {BRAND_SUGGESTIONS.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />

        <label>Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewProduct({ ...newProduct, main_image: e.target.files[0] })}
        />

        <label>Extra Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setNewProduct({ ...newProduct, images: e.target.files })}
        />

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Images</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {p.main_image && (
                    <img
                      src={p.main_image}
                      alt={p.name}
                      style={{ width: 60, height: 60, objectFit: "cover", border: "1px solid #ccc" }}
                    />
                  )}
                  {p.images?.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={p.name}
                      style={{ width: 60, height: 60, objectFit: "cover", border: "1px solid #ccc" }}
                    />
                  ))}
                </td>
                <td>
                  <button onClick={() => handleRemove(p.id)}>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
