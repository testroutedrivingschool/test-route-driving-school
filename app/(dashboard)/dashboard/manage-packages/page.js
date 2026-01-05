"use client";

import React, {useState} from "react";
import axios from "axios";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import Modal from "@/app/shared/ui/Modal";
import {FaPlus, FaEdit, FaTrash} from "react-icons/fa";
import Image from "next/image";
import {GoPackage} from "react-icons/go";
const categoryOptions = [
  {value: "", label: "Select a Category"},
  {value: "all", label: "All Categories"},
  {value: "driving-lesson", label: "Driving Lesson"},
  {value: "vouchers", label: "Vouchers"},
  {value: "test-package", label: "Test Packages"},
];
export default function ManagePackages() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    packageThumbline: "",
    lessons: "",
    duration: "",
    durationNum: "",
    price: "",
    originalPrice: "",
    description: "",
    features: "",
    popular: false,
    category: "",
    imageFile: null,
  });

  /* ================= GET ================= */
  const {data: packages = []} = useQuery({
    queryKey: ["packages"],
    queryFn: async () => (await axios.get("/api/packages")).data,
  });

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      form
    );

    return res.data.data.url;
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const {
      name,
      lessons,
      duration,
      durationNum,
      price,
      originalPrice,
      description,
      features,
      category,
      popular,
      imageFile,
    } = formData;

    if (
      !name ||
      !lessons ||
      !duration ||
      !durationNum ||
      !price ||
      !description ||
      !features
    ) {
      return toast.error(`Please fill all fields`);
    }
    if (!category) {
      return toast.error("Please Select a Category");
    }
    try {
      let imageUrl = editingPackage?.packageThumbline || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name,
        packageThumbline: imageUrl,
        lessons: Number(lessons),
        duration,
        durationNum: Number(durationNum),
        price: Number(price),
        originalPrice: Number(originalPrice),
        savings: Number(originalPrice) - Number(price),
        description,
        features: features.split(",").map((f) => f.trim()),
        popular,
        category,
      };

      if (editingPackage) {
        await axios.put(`/api/packages?id=${editingPackage._id}`, payload);
        toast.success("Package updated successfully");
      } else {
        await axios.post("/api/packages", payload);
        toast.success("Package added successfully");
      }

      setShowModal(false);
      setEditingPackage(null);
      setFormData({
        name: "",
        packageThumbline: "",
        lessons: "",
        duration: "",
        durationNum: "",
        price: "",
        originalPrice: "",
        description: "",
        features: "",
        popular: false,
        category: "",
        imageFile: null,
      });

      queryClient.invalidateQueries(["packages"]);
    } catch {
      toast.error("Failed to save package");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      ...pkg,
      features: pkg.features.join(", "),
      imageFile: null,
    });
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;
    await axios.delete(`/api/packages?id=${id}`);
    toast.success("Package deleted");
    queryClient.invalidateQueries(["packages"]);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-3xl font-bold  flex items-center gap-2">
          <GoPackage />
          Manage Packages
        </h2>
        <button
          onClick={() => {
            setEditingPackage(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          <FaPlus /> Add Package
        </button>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white rounded-xl shadow border border-border-color p-4 flex flex-col"
          >
            <Image
              width={600}
              height={600}
              src={pkg.packageThumbline}
              alt={pkg.name}
              className="h-40 w-full object-cover object-top rounded-lg mb-3"
            />

            <h3 className="font-bold text-lg">{pkg.name}</h3>
            <p className="text-gray-600 text-sm ">
              {pkg.description.length > 60
                ? pkg.description.slice(0, 60) + "..."
                : pkg.description}
            </p>

            <div className="mt-2 text-sm text-gray-700">
              <p>Lessons: {pkg.lessons}</p>
              <p>Duration: {pkg.duration}</p>
              <p className="font-semibold text-primary">৳ {pkg.price}</p>
            </div>

            <div className="mt-auto flex gap-2 pt-4">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex-1 flex items-center justify-center gap-1 border border-primary text-primary py-1.5 rounded-lg hover:bg-primary hover:text-white transition"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(pkg._id)}
                className="flex-1 flex items-center justify-center gap-1 border border-red-500 text-red-500 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 className="text-2xl font-bold mb-4">
            {editingPackage ? "Edit Package" : "Add Package"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Name", "name"],

              ["Lessons", "lessons", "number"],
              ["Duration Text", "duration"],
              ["Duration Number", "durationNum", "number"],
              ["Price", "price", "number"],
              ["Original Price", "originalPrice", "number"],
            ].map(([label, key, type = "text"]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({...formData, [key]: e.target.value})
                  }
                  className="border border-border-color rounded-lg px-3 py-2"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({...formData, category: e.target.value})
                }
                className="border border-border-color rounded-lg px-3 py-2 w-full"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({...formData, description: e.target.value})
                }
                className="border border-border-color  rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Features (comma separated)
              </label>
              <textarea
                rows={2}
                value={formData.features}
                onChange={(e) =>
                  setFormData({...formData, features: e.target.value})
                }
                className="border border-border-color rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Package Image
              </label>
              <input
                className="border border-border-color font-semibold p-2 cursor-pointer"
                type="file"
                onChange={(e) =>
                  setFormData({...formData, imageFile: e.target.files[0]})
                }
              />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) =>
                  setFormData({...formData, popular: e.target.checked})
                }
              />
              <span className="text-sm font-medium">Popular Package</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
          >
            {editingPackage ? "Update Package" : "Add Package"}
          </button>
        </Modal>
      )}
    </div>
  );
}
