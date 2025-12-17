// front/src/page/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  updateUser,
  getRestaurants,
  getAssociations,
} from "@/api/admin";

export default function AdminUsers() {
  const queryClient = useQueryClient();

  // Load users
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getUsers().then((res) => res.data),
  });

  // Load restaurants for RESTO_AGENT linking
  const {
    data: restaurants = [],
    isLoading: isLoadingRestaurants,
    error: restaurantsError,
  } = useQuery({
    queryKey: ["admin-restaurants-for-users"],
    queryFn: () => getRestaurants().then((res) => res.data),
  });

  // Load associations for ASSO_AGENT linking
  const {
    data: associations = [],
    isLoading: isLoadingAssociations,
    error: associationsError,
  } = useQuery({
    queryKey: ["admin-associations-for-users"],
    queryFn: () =>
      getAssociations({
        // you can pass search/sort params if you want
        sort: "name",
        order: "asc",
      }).then((res) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      updateUser(id, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
    },
  });

  const handleChangeRole = (user, newRole) => {
    updateMutation.mutate({
      id: user.id,
      payload: { role: newRole },
    });
  };

  const handleChangeRestaurant = (user, restaurantId) => {
    const restId = restaurantId ? Number(restaurantId) : null;
    updateMutation.mutate({
      id: user.id,
      payload: {
        role: "RESTO_AGENT",
        restaurant_id: restId,
        // optionally clear association_id if you want them exclusive:
        // association_id: null,
      },
    });
  };

  const handleChangeAssociation = (user, associationId) => {
    const assocId = associationId ? Number(associationId) : null;
    updateMutation.mutate({
      id: user.id,
      payload: {
        role: "ASSO_AGENT",
        association_id: assocId,
        // optionally clear restaurant_id if you want them exclusive:
        // restaurant_id: null,
      },
    });
  };

  if (
    isLoadingUsers ||
    isLoadingRestaurants ||
    isLoadingAssociations
  ) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-zinc-600">
        Loading users...
      </div>
    );
  }

  if (usersError || restaurantsError || associationsError) {
    return (
      <div className="mx-auto mt-20 max-w-6xl px-4 text-sm text-red-600">
        Error loading users, restaurants or associations.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Admin – Users
      </h1>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Users ({users.length})
        </h2>

        {users.length === 0 ? (
          <div className="text-sm text-zinc-500">No users.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-zinc-700">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Association</th>
                  <th className="px-3 py-2 font-medium">Restaurant</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-100">
                    <td className="px-3 py-2">#{u.id}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.name || "—"}</td>
                    <td className="px-3 py-2">
                      <select
                        className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
                        value={u.role || ""}
                        onChange={(e) =>
                          handleChangeRole(u, e.target.value || "ASSO_AGENT")
                        }
                        disabled={updateMutation.isLoading}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="ASSO_AGENT">ASSO_AGENT</option>
                        <option value="RESTO_AGENT">RESTO_AGENT</option>
                      </select>
                    </td>

                    {/* Association column */}
                    <td className="px-3 py-2">
                      {u.role === "ASSO_AGENT" ? (
                        <select
                          className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
                          value={u.association_id ?? ""}
                          onChange={(e) =>
                            handleChangeAssociation(u, e.target.value)
                          }
                          disabled={updateMutation.isLoading}
                        >
                          <option value="">— none —</option>
                          {associations.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name || `(Asso #${a.id})`}
                            </option>
                          ))}
                        </select>
                      ) : u.association_id != null ? (
                        `#${u.association_id}`
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Restaurant column */}
                    <td className="px-3 py-2">
                      {u.role === "RESTO_AGENT" ? (
                        <select
                          className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
                          value={u.restaurant_id ?? ""}
                          onChange={(e) =>
                            handleChangeRestaurant(u, e.target.value)
                          }
                          disabled={updateMutation.isLoading}
                        >
                          <option value="">— none —</option>
                          {restaurants.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name || `(Resto #${r.id})`}
                            </option>
                          ))}
                        </select>
                      ) : u.restaurant_id != null ? (
                        `#${u.restaurant_id}`
                      ) : (
                        "—"
                      )}
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