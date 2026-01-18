"use client";

import { useState } from "react";
import Container from "@/app/shared/ui/Container";
import { FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";

export default function ProductSalesPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [description, setDescription] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: call API with dateFrom, dateTo, description
    console.log({ dateFrom, dateTo, description });
  };

  return (
    <section className="py-8">
      <Container>
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Search for Web Sales
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row lg:items-center  gap-8"
        >
          {/* Left fields */}
          <div className="space-y-2  ">
            {/* Date From */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-gray-800 font-medium">Date From:</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-class py-2!"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Date To */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-gray-800 font-medium">Date To:</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-class py-2!"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-gray-800 font-medium">Description:</label>
              <input
                type="text"
                placeholder="Search for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-class py-2! "
              />
            </div>
          </div>

          {/* Middle Search button */}
          <div className="flex justify-center lg:justify-center">
            <button
              type="submit"
              className="w-[220px] h-12 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-md shadow-sm"
            >
              Search
            </button>
          </div>

        </form>

        {/* Divider */}
        <div className="border-t border-gray-200 my-10" />

        {/* No data found */}
        <div className="flex items-start gap-6">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">No data found</h2>
          </div>
        </div>
      </Container>
    </section>
  );
}
