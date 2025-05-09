import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaPills,
  FaPrescriptionBottleAlt,
  FaCalendarAlt,
  FaListAlt,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { axiosInstance } from "../../API/axiosInstance";

export default function MedicinePage2() {
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Medicine Inventory</h1>
        <button
          onClick={() => setShowMedicineModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus className="inline mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          icon={<FaPills />}
          label="Total Medicines"
          value={medicines.length}
        />
        <DashboardCard
          icon={<FaPrescriptionBottleAlt />}
          label="Low Stock"
          value={medicines.filter((m) => m.stock < 10).length}
        />
        <DashboardCard
          icon={<FaCalendarAlt />}
          label="Expiring Soon"
          value={
            medicines.filter(
              (m) =>
                new Date(m.expiryDate) < new Date(Date.now() + 30 * 86400000)
            ).length
          }
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search medicines..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Medicine Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Brand</th>
              <th className="px-4 py-3 border-b">Expiry Date</th>
              <th className="px-4 py-3 border-b">Stock</th>
              <th className="px-4 py-3 border-b">Category</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id} className="text-sm text-gray-600">
                <td className="px-4 py-3 border-b">{medicine.name}</td>
                <td className="px-4 py-3 border-b">{medicine.brand}</td>
                <td className="px-4 py-3 border-b">{medicine.expiryDate}</td>
                <td className="px-4 py-3 border-b">{medicine.stock}</td>
                <td className="px-4 py-3 border-b">{medicine.category}</td>
                <td className="px-4 py-3 border-b flex items-center space-x-2">
                  <button
                    onClick={() => alert(JSON.stringify(medicine, null, 2))}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => alert("Edit functionality here")}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() =>
                      setMedicines((prev) =>
                        prev.filter((m) => m.id !== medicine.id)
                      )
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showMedicineModal && (
        <AddMedicineModal
          onClose={() => setShowMedicineModal(false)}
          onAdd={(newMedicine) =>
            setMedicines((prev) => [
              ...prev,
              { ...newMedicine, id: Date.now() },
            ])
          }
        />
      )}
    </div>
  );
}

function DashboardCard({ icon, label, value }) {
  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="text-blue-500 text-2xl mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function AddMedicineModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    expiryDate: "",
    stock: 0,
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) : value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axiosInstance.post("/api/medicine", formData);
    console.log("Medicine added:", response.data);
    onAdd(response.data); // optionally pass the created item
    onClose();
  } catch (error) {
    console.error("Failed to add medicine:", error);
    // optionally show an error toast or message
  }
};

  return (
    <div className="fixed inset-0  bg-black  bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Add Medicine</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Medicine Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, col = "" }) {
  return (
    <div className={`flex items-start ${col}`}>
      <div className="text-blue-500 mr-2 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );
}
