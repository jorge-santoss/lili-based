// src/page/admin/AdminAssociationsList.jsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAssociations, createAssociation } from "../../api/admin.js";

export default function AdminAssociationsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    sort: "name",
    order: "asc",
    limit: 50,
    offset: 0,
  });

  // Create form state
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newMeals, setNewMeals] = useState("");
  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: (payload) => createAssociation(payload).then((res) => res.data),
    onSuccess: () => {
      setNewName("");
      setNewAddress("");
      setNewEmail("");
      setNewPhone("");
      setNewMeals("");
      setFormError("");
      queryClient.invalidateQueries(["admin-associations"]);
    },
    onError: () => {
      setFormError("Failed to create association");
    },
  });

  function handleCreate(e) {
    e.preventDefault();
    setFormError("");

    const meals = Number(newMeals || 0);
    if (!newName.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (Number.isNaN(meals) || meals < 0) {
      setFormError("Meals available must be a non-negative number.");
      return;
    }

    createMutation.mutate({
      name: newName.trim(),
      address: newAddress,
      email: newEmail,
      phone: newPhone,
      contact_name: "",
      meals_available: meals,
    });
  }

  // Fetch associations
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-associations", filters],
    queryFn: () => getAssociations(filters).then((res) => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  function toggleSort(column) {
    setFilters((prev) => {
      if (prev.sort === column) {
        return { ...prev, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { ...prev, sort: column, order: "asc" };
    });
  }

  function onSearchChange(e) {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value, offset: 0 }));
  }

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-zinc-600">
        Loading associations…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-red-600">
        Error loading associations
      </div>
    );
  }

  const sortIcon = (col) =>
    filters.sort === col ? (filters.order === "asc" ? "▲" : "▼") : "";

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Associations
      </h1>

      {/* Create association form */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Create association
        </h2>

        <form
          onSubmit={handleCreate}
          className="space-y-3 text-sm"
        >
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[160px] flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Name *
              </label>
              <input
                type="text"
                placeholder="Name *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="min-w-[160px] flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Address
              </label>
              <input
                type="text"
                placeholder="Address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="min-w-[160px] flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="min-w-[120px]">
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Phone
              </label>
              <input
                type="text"
                placeholder="Phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Meals available
              </label>
              <input
                type="number"
                min="0"
                placeholder="Meals available"
                value={newMeals}
                onChange={(e) => setNewMeals(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isLoading ? "Creating..." : "Create association"}
          </button>

          {formError && (
            <div className="text-xs text-red-600">{formError}</div>
          )}
        </form>
      </div>

      {/* Search + refresh */}
      <div className="mb-3 flex gap-3 text-sm">
        <input
          type="search"
          placeholder="Search by name, address, email, contact..."
          value={filters.search}
          onChange={onSearchChange}
          className="flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Associations ({rows.length})
        </h2>

        {rows.length === 0 ? (
          <div className="text-sm text-zinc-500">No associations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-zinc-700">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th
                    className="cursor-pointer px-3 py-2 font-medium"
                    onClick={() => toggleSort("name")}
                  >
                    Name {sortIcon("name")}
                  </th>
                  <th
                    className="cursor-pointer px-3 py-2 font-medium"
                    onClick={() => toggleSort("address")}
                  >
                    Address {sortIcon("address")}
                  </th>
                  <th
                    className="cursor-pointer px-3 py-2 text-right font-medium"
                    onClick={() => toggleSort("meals_available")}
                  >
                    Meals available {sortIcon("meals_available")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      navigate(`/admin/associations/${row.id}`)
                    }
                    className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50"
                  >
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">
                      {row.address || "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.meals_available}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
