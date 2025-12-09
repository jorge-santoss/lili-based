// src/page/admin/AdminAssociationsList.jsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAssociations } from '../../api/admin.js';

export default function AdminAssociationsList() {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    sort: 'name',
    order: 'asc',
    limit: 50,
    offset: 0,
  });

  // React Query: fetch associations (we return response.data)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-associations', filters],
    queryFn: () => getAssociations(filters).then(res => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
  });

  // Toggle sort/order when clicking a column header
  function toggleSort(column) {
    setFilters(prev => {
      if (prev.sort === column) {
        return { ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      return { ...prev, sort: column, order: 'asc' };
    });
  }

  // Simple client-side search input handler
  function onSearchChange(e) {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value, offset: 0 }));
  }

  // Derived rows (data may be axios response array)
  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  if (isLoading) {
    return <div>Loading associations…</div>;
  }

  if (error) {
    return <div>Error loading associations</div>;
  }

  return (
    <div className="admin-associations">
      <h2>Associations</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input
          type="search"
          placeholder="Search by name, address, email, contact..."
          value={filters.search}
          onChange={onSearchChange}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={() => refetch()}>Refresh</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              onClick={() => toggleSort('name')}
              style={{ cursor: 'pointer', textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}
            >
              Name {filters.sort === 'name' ? (filters.order === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              onClick={() => toggleSort('address')}
              style={{ cursor: 'pointer', textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}
            >
              Address {filters.sort === 'address' ? (filters.order === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              onClick={() => toggleSort('meals_available')}
              style={{ cursor: 'pointer', textAlign: 'right', padding: 8, borderBottom: '1px solid #ddd' }}
            >
              Meals available {filters.sort === 'meals_available' ? (filters.order === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: 12 }}>
                No associations found.
              </td>
            </tr>
          )}

          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate(`/admin/associations/${row.id}`)}
              style={{ cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
            >
              <td style={{ padding: 8 }}>{row.name}</td>
              <td style={{ padding: 8 }}>{row.address}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{row.meals_available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
