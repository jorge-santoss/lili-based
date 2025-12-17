// src/page/resto/RestoDashboard.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyRestaurantProfile,
  updateMyRestaurantProfile,
} from "@/api/resto";
import { useEffect, useState } from "react";

export default function RestoDashboard() {
  const queryClient = useQueryClient();

  // Profil resto
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["resto-profile"],
    queryFn: () => getMyRestaurantProfile().then((res) => res.data),
  });

  // Form state pour le profil (infos de base + profil de service)
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [options, setOptions] = useState("");
  const [minDelay, setMinDelay] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [closedUntil, setClosedUntil] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Hydrate le formulaire quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setAddress(profile.address ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setCuisine(profile.cuisine ?? "");
      setOptions(profile.options ?? "");
      setMinDelay(
        typeof profile.min_delay_minutes === "number"
          ? String(profile.min_delay_minutes)
          : ""
      );
      setIsClosed(!!profile.is_closed);
      if (profile.closed_until) {
        const d = new Date(profile.closed_until);
        const iso = d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
        setClosedUntil(iso);
      } else {
        setClosedUntil("");
      }
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (payload) =>
      updateMyRestaurantProfile(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resto-profile"]);
      setSaveError("");
      setSaveSuccess("Profil mis à jour.");
      setTimeout(() => setSaveSuccess(""), 3000);
    },
    onError: () => {
      setSaveError("Impossible de mettre à jour le profil restaurant.");
    },
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");

    updateMutation.mutate({
      // infos de base
      name: name || null,
      address: address || null,
      email: email || null,
      phone: phone || null,
      // profil de service
      cuisine: cuisine || null,
      options: options || null,
      min_delay_minutes: minDelay ? Number(minDelay) : 0,
      is_closed: isClosed,
      closed_until: closedUntil || null,
    });
  };

  if (profileLoading) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-zinc-600">
        Chargement…
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-red-600">
        Erreur de chargement du profil restaurant
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Dashboard restaurant
      </h1>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800">
          Profil du restaurant
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          Gérez les informations de base de votre restaurant et votre profil de
          service (cuisine, options, délai minimum, fermeture temporaire).
        </p>

        <form onSubmit={handleSaveProfile} className="space-y-3 text-sm">
          {/* Infos de base */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Nom du restaurant
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Resto Test"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Adresse
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: 2 rue de resto"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@restaurant.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                Téléphone
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0600000000"
              />
            </div>
          </div>

          <hr className="my-2 border-zinc-200" />

          {/* Profil de service */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Cuisine
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Ex: Italien, Sandwich, Asiatique…"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Options (séparées par des virgules)
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Ex: végétarien,sans porc,sans gluten"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Délai minimum avant réservation (minutes)
            </label>
            <input
              type="number"
              min="0"
              className="w-32 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={minDelay}
              onChange={(e) => setMinDelay(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_closed"
              type="checkbox"
              className="h-3 w-3 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
              checked={isClosed}
              onChange={(e) => setIsClosed(e.target.checked)}
            />
            <label htmlFor="is_closed" className="text-xs text-zinc-700">
              Restaurant fermé temporairement
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Fermé jusqu&apos;au (optionnel)
            </label>
            <input
              type="datetime-local"
              className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={closedUntil}
              onChange={(e) => setClosedUntil(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center rounded-md border border-zinc-300 bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Sauvegarde..." : "Enregistrer"}
          </button>

          {saveError && (
            <div className="text-xs text-red-600">{saveError}</div>
          )}
          {saveSuccess && (
            <div className="text-xs text-emerald-600">{saveSuccess}</div>
          )}
        </form>
      </div>
    </div>
  );
}
