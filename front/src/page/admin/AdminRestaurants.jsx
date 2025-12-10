import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRestaurants, createRestaurant } from "@/api/restaurants";

export default function AdminRestaurants() {
  const queryClient = useQueryClient();
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: () => getRestaurants().then(res => res.data),
  });

  const [form, setForm] = useState({ name: "", address: "", email: "", phone: "" });

  const mutation = useMutation({
    mutationFn: (payload) => createRestaurant(payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-restaurants"]);
      setForm({ name: "", address: "", email: "", phone: "" });
    },
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) return <div>Loading restaurants...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin – Restaurants</h1>

      <form onSubmit={onSubmit} style={{ marginBottom: 24 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={onChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={onChange}
        />
        <button type="submit" disabled={mutation.isLoading}>
          Create restaurant
        </button>
      </form>

      <ul>
        {restaurants.map(r => (
          <li key={r.id}>
            {r.id} – {r.name} {r.address ? `(${r.address})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
