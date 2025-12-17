import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useRouteError } from "react-router-dom";
import "./index.css";
import Header from "./layout/Header";
import Login from "./page/auth/login";
import Home from "./page/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Register from "./page/auth/register";

import AdminAssociationsList from "./page/admin/AdminAssociationsList";
import AdminAssociationDetail from "./page/admin/AdminAssociationDetail";
import BookingsTest from "./page/asso/bookings-test.jsx";
// import { R } from "@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o";
import AdminRestaurants from "./page/admin/AdminRestaurants";
import AdminRestaurantDetail from "./page/admin/AdminRestaurantDetail";
import MyBookings from "./page/asso/MyBookings";
import RestoBookings from "./page/resto/RestoBookings";

// Dashboard imports
import AdminDashboard from "./page/admin/AdminDashboard";
import AssoDashboard from "./page/asso/AssoDashboard";
import RestoDashboard from "./page/resto/RestoDashboard";
import AdminBookings from "./page/admin/AdminBookings.jsx";

import AdminStats from "./page/admin/AdminStats";

// import AdminUsersLink from "@/page/admin/AdminUsersLink";
import AdminUsers from "@/page/admin/AdminUsers";

import AssoBeneficiaries from "./page/asso/AssoBeneficiaries";




const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/associations" element={<AdminAssociationsList />} />
        <Route
          path="/admin/associations/:id"
          element={<AdminAssociationDetail />}
        />
        <Route path="/admin/bookings" element={<AdminBookings />} />

        {/* Booking routes dev sandbox only for test*/}
        <Route path="/asso" element={<AssoDashboard />} />
        <Route path="/asso/bookings-test" element={<BookingsTest />} />

        {/* Booking routes */}
        <Route path="/asso/bookings" element={<MyBookings />} />

        <Route path="/asso/beneficiaries" element={<AssoBeneficiaries />} />

        {/* Resto bookings */}
        <Route path="/resto" element={<RestoDashboard />} />
        <Route path="/resto/bookings" element={<RestoBookings />} />

        {/* Create Restaurant route */}
        <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        <Route
          path="/admin/restaurants/:id"
          element={<AdminRestaurantDetail />}
        />

        <Route path="/admin/stats" element={<AdminStats />} />
        {/* 
<Route path="/admin/users/link" element={<AdminUsersLink />} /> */}

        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
);
