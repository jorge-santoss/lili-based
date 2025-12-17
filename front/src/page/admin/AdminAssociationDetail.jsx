// src/page/admin/AdminAssociationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAssociation,
  updateAssociationMeals,
  updateAssociation,
  deleteAssociation,
} from "@/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAssociationDetail() {
  const { id } = useParams();
  const assocId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch association
  const {
    data: association,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-association", assocId],
    queryFn: () => getAssociation(assocId).then((res) => res.data),
    enabled: !!assocId,
    staleTime: 1000 * 60,
  });

  // Local state for fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [mealsValue, setMealsValue] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Sync local state when association loads
  useEffect(() => {
    if (association) {
      setName(association.name ?? "");
      setAddress(association.address ?? "");
      setEmail(association.email ?? "");
      setPhone(association.phone ?? "");
      setContactName(association.contact_name ?? "");
      setMealsValue(association.meals_available ?? 0);
    }
  }, [association]);

  // Mutation to update association fields
  const updateMutation = useMutation({
    mutationFn: (payload) =>
      updateAssociation(assocId, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-association", assocId]);
      queryClient.invalidateQueries(["admin-associations"]);
      setFormError("");
      setSuccess("Association updated.");
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: () => {
      setFormError("Failed to update association");
    },
  });

  // Optional: meals-only mutation if still used elsewhere
  const mealsMutation = useMutation({
    mutationFn: ({ id, mealsAvailable }) =>
      updateAssociationMeals(id, mealsAvailable).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-association", assocId]);
      queryClient.invalidateQueries(["admin-associations"]);
    },
  });

  // Delete mutation
  const deleteMut = useMutation({
    mutationFn: () => deleteAssociation(assocId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-associations"]);
      navigate("/admin/associations");
    },
    onError: (err) => {
      console.error("Delete association error", err);
      setDeleteError("Failed to delete association.");
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4 text-sm text-zinc-600">
        Loading association...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4 text-sm text-red-600">
        Failed to load association
      </div>
    );
  }

  if (!association) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4 text-sm text-zinc-600">
        Association not found.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const mealsNum = Number(mealsValue);
    if (Number.isNaN(mealsNum) || mealsNum < 0) {
      setFormError("Meals available must be a non-negative number.");
      return;
    }

    updateMutation.mutate({
      name,
      address,
      email,
      phone,
      contact_name: contactName,
      meals_available: mealsNum,
    });
  };

  return (
    <div className="mx-auto mt-20 max-w-3xl px-4 pb-10">
      <button
        type="button"
        onClick={() => navigate("/admin/associations")}
        className="mb-4 text-xs text-blue-600 hover:underline"
      >
        ← Back to associations
      </button>

      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Association #{association.id}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-medium text-zinc-700">
            Name
          </label>
          <Input
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700">
            Address
          </label>
          <Input
            className="mt-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-700">
              Email
            </label>
            <Input
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700">
              Phone
            </label>
            <Input
              className="mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700">
            Contact name
          </label>
          <Input
            className="mt-1"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700">
            Meals available
          </label>
          <Input
            type="number"
            min={0}
            className="mt-1"
            value={mealsValue}
            onChange={(e) => setMealsValue(e.target.value)}
          />
        </div>

        {formError && (
          <p className="text-xs text-red-600">{formError}</p>
        )}
        {success && (
          <p className="text-xs text-emerald-600">{success}</p>
        )}

        <div className="mt-2 flex items-center gap-3">
          <Button
            type="submit"
            size="sm"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-red-700">
          Danger zone
        </h2>

        {deleteError && (
          <p className="mb-2 text-xs text-red-600">{deleteError}</p>
        )}

        {!confirmDelete ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmDelete(true)}
          >
            Delete association
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-red-700">
              Are you sure? This action cannot be undone.
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMut.mutate()}
              disabled={deleteMut.isLoading}
            >
              {deleteMut.isLoading ? "Deleting..." : "Yes, delete"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
