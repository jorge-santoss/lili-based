// src/page/admin/AdminRestaurantDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/api/admin";

export default function AdminRestaurantDetail() {
  const { id } = useParams();
  const restaurantId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-restaurant", restaurantId],
    queryFn: () => getRestaurant(restaurantId).then((res) => res.data),
    enabled: !!restaurantId,
  });

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name ?? "",
        address: restaurant.address ?? "",
        email: restaurant.email ?? "",
        phone: restaurant.phone ?? "",
      });
    }
  }, [restaurant]);

  const updateMut = useMutation({
    mutationFn: (payload) =>
      updateRestaurant(restaurantId, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-restaurant", restaurantId]);
      queryClient.invalidateQueries(["admin-restaurants"]);
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteRestaurant(restaurantId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-restaurants"]);
      navigate("/admin/restaurants");
    },
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateMut.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 max-w-4xl px-4 text-sm text-zinc-600">
        Loading restaurant...
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="mx-auto mt-20 max-w-4xl px-4 text-sm text-red-600">
        Error loading restaurant
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-4xl px-4 pb-10">
      <h1 className="mb-2 text-lg font-semibold text-zinc-800">
        Restaurant detail
      </h1>

      <p className="mb-4 text-sm text-zinc-600">
        <span className="font-medium text-zinc-800">Association&nbsp;:</span>{" "}
        {restaurant.association_name
          ? restaurant.association_name
          : restaurant.association_id
          ? `#${restaurant.association_id}`
          : "None"}
      </p>

      {/* Formulaire d'édition */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Informations du restaurant
        </h2>

        <form
          onSubmit={onSubmit}
          className="grid gap-3 text-sm sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
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

          <div className="sm:col-span-2">
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

          <div>
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

          <div>
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

          <div className="sm:col-span-2 mt-2 flex gap-3">
            <button
              type="submit"
              disabled={updateMut.isLoading}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateMut.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Suppression */}
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={deleteMut.isLoading}
            className="rounded-md border border-red-400 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete restaurant
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span>Are you sure?</span>
            <button
              type="button"
              onClick={() => {
                deleteMut.mutate();
              }}
              disabled={deleteMut.isLoading}
              className="rounded-md border border-red-500 bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteMut.isLoading ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/admin/restaurants")}
        className="text-xs font-medium text-zinc-700 hover:underline"
      >
        ← Back to list
      </button>
    </div>
  );
}
