// src/page/admin/AdminRestaurants.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRestaurants, createRestaurant } from "@/api/admin";

export default function AdminRestaurants() {
  const queryClient = useQueryClient();

  const {
    data: restaurants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: () => getRestaurants().then((res) => res.data),
  });

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const mutation = useMutation({
    mutationFn: (payload) => createRestaurant(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-restaurants"]);
      setForm({ name: "", address: "", email: "", phone: "" });
    },
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-zinc-600">
        Loading restaurants...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-red-600">
        Error loading restaurants
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Admin – Restaurants
      </h1>

      {/* Formulaire de création */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Créer un restaurant
        </h2>
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap items-end gap-3 text-sm"
        >
          <div className="flex-1 min-w-[140px]">
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Name
            </label>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Address
            </label>
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={onChange}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Email
            </label>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Phone
            </label>
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="mt-2 inline-flex items-center justify-center rounded-md border border-zinc-300 bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isLoading ? "Creating..." : "Create restaurant"}
          </button>
        </form>
      </div>

      {/* Tableau des restaurants */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Restaurants ({restaurants.length})
        </h2>

        {restaurants.length === 0 ? (
          <div className="text-sm text-zinc-500">Aucun restaurant.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-zinc-700">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Restaurant name</th>
                  <th className="px-3 py-2 font-medium">Address</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-100">
                    <td className="px-3 py-2">#{r.id}</td>
                    <td className="px-3 py-2">
                      <Link
                        to={`/admin/restaurants/${r.id}`}
                        className="font-medium text-zinc-900 hover:underline"
                      >
                        {r.name || "(Sans nom)"}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{r.address || "—"}</td>
                    <td className="px-3 py-2">{r.email || "—"}</td>
                    <td className="px-3 py-2">{r.phone || "—"}</td>
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
