// src/page/admin/AdminUsersLink.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { linkUser } from "@/api/admin";

export default function AdminUsersLink() {
  const [userId, setUserId] = useState("");
  const [associationId, setAssociationId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [message, setMessage] = useState("");

  const mut = useMutation({
    mutationFn: (payload) =>
      linkUser(Number(userId), payload).then((res) => res.data),
    onSuccess: (data) => {
      setMessage(
        `User updated: association_id=${data.association_id ?? "null"}, restaurant_id=${data.restaurant_id ?? "null"}`
      );
    },
    onError: () => {
      setMessage("Failed to update user.");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!userId || Number.isNaN(Number(userId))) {
      setMessage("Invalid user id.");
      return;
    }

    const payload = {};
    if (associationId !== "") payload.associationId = Number(associationId);
    if (restaurantId !== "") payload.restaurantId = Number(restaurantId);

    mut.mutate(payload);
  };

  return (
    <div className="mx-auto mt-20 max-w-md px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Link user to association / restaurant
      </h1>

      <form onSubmit={onSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block text-xs font-medium text-zinc-700">
            User ID
          </label>
          <input
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700">
            Association ID (leave empty for NULL)
          </label>
          <input
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            value={associationId}
            onChange={(e) => setAssociationId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700">
            Restaurant ID (leave empty for NULL)
          </label>
          <input
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={mut.isLoading}
          className="mt-2 rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
        >
          {mut.isLoading ? "Updating..." : "Update user links"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-xs text-zinc-700">
          {message}
        </p>
      )}
    </div>
  );
}
