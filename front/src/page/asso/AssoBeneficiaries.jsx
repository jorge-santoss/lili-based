// src/page/asso/AssoBeneficiaries.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyBeneficiaries,
  updateMyBeneficiary,
  deleteMyBeneficiary,
} from "@/api/asso";

export default function AssoBeneficiaries() {
  const queryClient = useQueryClient();

  const {
    data: beneficiaries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["asso-beneficiaries"],
    queryFn: () => getMyBeneficiaries().then((res) => res.data),
  });

  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthYear: "",
    rgpdAccepted: false,
  });
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMut = useMutation({
    mutationFn: (payload) =>
      updateMyBeneficiary(Number(selectedId), payload).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["asso-beneficiaries"]);
      setMessage(`Beneficiary #${data.id} updated.`);
    },
    onError: () => {
      setMessage("Failed to update beneficiary.");
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteMyBeneficiary(Number(selectedId)).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["asso-beneficiaries"]);
      setMessage(`Beneficiary #${selectedId} deleted.`);
      setSelectedId("");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthYear: "",
        rgpdAccepted: false,
      });
      setConfirmDelete(false);
    },
    onError: () => {
      setMessage("Failed to delete beneficiary.");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedId || Number.isNaN(Number(selectedId))) {
      setMessage("Please select a beneficiary.");
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || null,
      birthYear: form.birthYear ? Number(form.birthYear) : null,
      rgpdAccepted: !!form.rgpdAccepted,
    };

    updateMut.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-zinc-600">
        Loading beneficiaries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-5xl px-4 text-sm text-red-600">
        Failed to load beneficiaries
      </div>
    );
  }

  const selected =
    selectedId &&
    beneficiaries.find((b) => b.id === Number(selectedId));

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
      <h1 className="mb-4 text-lg font-semibold text-zinc-800">
        Beneficiaries
      </h1>

      <div className="mb-6 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-xs text-zinc-700">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">First name</th>
              <th className="px-3 py-2 font-medium">Last name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">Birth year</th>
              <th className="px-3 py-2 font-medium">Select</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((b) => (
              <tr key={b.id} className="border-b border-zinc-100">
                <td className="px-3 py-2">{b.id}</td>
                <td className="px-3 py-2">{b.first_name}</td>
                <td className="px-3 py-2">{b.last_name}</td>
                <td className="px-3 py-2">{b.email}</td>
                <td className="px-3 py-2">{b.phone ?? "—"}</td>
                <td className="px-3 py-2">{b.birth_year ?? "—"}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(String(b.id));
                      setForm({
                        firstName: b.first_name ?? "",
                        lastName: b.last_name ?? "",
                        email: b.email ?? "",
                        phone: b.phone ?? "",
                        birthYear: b.birth_year ?? "",
                        rgpdAccepted: !!b.rgpd_accepted,
                      });
                      setMessage("");
                      setConfirmDelete(false);
                    }}
                    className={`rounded px-2 py-0.5 text-[11px] ${
                      String(b.id) === selectedId
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Update form */}
          <form onSubmit={onSubmit} className="space-y-3 text-sm">
            <h2 className="text-sm font-semibold text-zinc-800">
              Edit beneficiary #{selected.id}
            </h2>
            <p className="text-xs text-zinc-700">{selected.email}</p>

            <div>
              <label className="block text-xs font-medium text-zinc-700">
                First name
              </label>
              <input
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700">
                Last name
              </label>
              <input
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700">
                Email
              </label>
              <input
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700">
                Phone
              </label>
              <input
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700">
                Birth year
              </label>
              <input
                type="number"
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
                value={form.birthYear}
                onChange={(e) =>
                  setForm((f) => ({ ...f, birthYear: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="rgpd"
                type="checkbox"
                checked={form.rgpdAccepted}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rgpdAccepted: e.target.checked }))
                }
              />
              <label
                htmlFor="rgpd"
                className="text-xs font-medium text-zinc-700"
              >
                RGPD accepted
              </label>
            </div>

            <button
              type="submit"
              disabled={updateMut.isLoading}
              className="mt-2 rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
            >
              {updateMut.isLoading ? "Saving..." : "Save changes"}
            </button>
          </form>

          {/* Delete */}
          <div className="space-y-4 text-sm">
            <div className="rounded border border-red-200 bg-red-50 p-3">
              <h3 className="mb-2 text-xs font-semibold text-red-700">
                Danger zone
              </h3>
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white"
                >
                  Delete beneficiary
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-red-700">
                    Delete beneficiary #{selected.id}? This cannot be undone.
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteMut.mutate()}
                    disabled={deleteMut.isLoading}
                    className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
                  >
                    {deleteMut.isLoading ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded border px-3 py-1 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-xs text-zinc-700">{message}</p>
      )}
    </div>
  );
}
