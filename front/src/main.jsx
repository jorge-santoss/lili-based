import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useRouteError } from "react-router-dom";
import './index.css'
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


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})



const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient} >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

       


{/* Admin routes */}
        <Route path="/admin/associations" element={<AdminAssociationsList />} />
        <Route path="/admin/associations/:id" element={<AdminAssociationDetail />} />

{/* Booking routes */}
         <Route path="/asso/bookings-test" element={<BookingsTest />} />

         {/* Create Restaurant route */}
         <Route path="/admin/restaurants" element={<AdminRestaurants />} />

      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
);
