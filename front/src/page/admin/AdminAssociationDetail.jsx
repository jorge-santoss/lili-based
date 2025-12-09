// src/page/admin/AdminAssociationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssociation, updateAssociationMeals } from "../../api/admin.js";
import { Input } from "@/components/ui/input";    // named import
import { Button } from "@/components/ui/button";  // named import

export default function AdminAssociationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const assocId = Number(id);

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

  // Local state for meals input
  const [mealsValue, setMealsValue] = useState("");

  // Keep local input in sync when association loads/changes
  useEffect(() => {
    if (association) {
      setMealsValue(association.meals_available ?? 0);
    }
  }, [association]);

  // Mutation to update meals_available
  const mutation = useMutation({
    mutationFn: ({ id, mealsAvailable }) =>
      updateAssociationMeals(id, mealsAvailable).then((res) => res.data),
    onSuccess: () => {
      // Invalidate the association query so it refetches fresh data
      queryClient.invalidateQueries(["admin-association", assocId]);
      // Optionally invalidate list
      queryClient.invalidateQueries(["admin-associations"]);
    },
  });

  if (isLoading) return <div>Loading association…</div>;
  if (error) return <div>Error loading association</div>;
  if (!association) return <div>Association not found</div>;

  const handleSave = async (e) => {
    e.preventDefault();
    const parsed = Number(mealsValue);
    if (Number.isNaN(parsed) || parsed < 0) {
      return alert(
        "Please enter a valid non-negative number for meals available."
      );
    }
    try {
      await mutation.mutateAsync({ id: assocId, mealsAvailable: parsed });
      // Optionally show a success message
      // navigate back to list or keep on page
    } catch (err) {
      console.error(err);
      alert("Failed to update meals available.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>Association details</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Name</strong>
        <div>{association.name}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Address</strong>
        <div>{association.address}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Contact name</strong>
        <div>{association.contact_name}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Email</strong>
        <div>{association.email}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Phone</strong>
        <div>{association.phone}</div>
      </div>

      <form onSubmit={handleSave} style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 8 }}>
          <label
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Meals available (admin only)
          </label>
          <Input
            type="number"
            value={mealsValue}
            onChange={(e) => setMealsValue(e.target.value)}
            min={0}
            className="w-40"
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/associations")}
          >
            Back to list
          </Button>
        </div>
      </form>
    </div>
  );
}