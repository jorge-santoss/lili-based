// src/components/layout/Header.jsx (ou ton chemin actuel)
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flag, LogOut } from "lucide-react";
import { getCurrentUserFromToken } from "../utils/authUser";
import chickenLogo from "../images/dudel-draw.png";

export default function Header() {
  const navigate = useNavigate();
  const user = getCurrentUserFromToken();
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <header className="fixed top-0 z-20 w-full border-b border-zinc-200 bg-zinc-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
         

         <div className="flex h-8 w-8 items-center justify-center">
  <img
    src={chickenLogo}
    alt="Chicken logo"
    className="h-8 w-8 object-contain"
  />
</div>

          <span className="text-sm font-semibold tracking-tight text-zinc-800">
            Les Repas de Lili
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm">
          {role === "ADMIN" && (
            <>
              <Link to="/admin" className="text-zinc-700 hover:text-zinc-900">
                Dashboard
              </Link>

              <Link
                to="/admin/stats"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Statistiques
              </Link>

              {/* <Link to="/admin/users/link" className="hover:underline">
                Link users
              </Link> */}
              <Link to="/admin/users" className="hover:underline">
                Users
              </Link>

              <Link
                to="/admin/associations"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Associations
              </Link>
              <Link
                to="/admin/restaurants"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Restaurants
              </Link>
              <Link
                to="/admin/bookings"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Réservations
              </Link>
            </>
          )}

          {role === "ASSO_AGENT" && (
            <>
              <Link to="/asso" className="text-zinc-700 hover:text-zinc-900">
                Dashboard asso
              </Link>
              <Link
                to="/asso/bookings"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Mes réservations
              </Link>

              <Link
                to="/asso/beneficiaries"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Beneficiaires
              </Link>
            </>
          )}

          {role === "RESTO_AGENT" && (
            <>
              <Link to="/resto" className="text-zinc-700 hover:text-zinc-900">
                Dashboard resto
              </Link>
              <Link
                to="/resto/bookings"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Réservations
              </Link>
            </>
          )}

          {/* Right side: auth */}
          {!user && (
            <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
              <Link
                className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                to="/auth/login"
              >
                Connexion
              </Link>
              <Link
                className="rounded-md border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600"
                to="/auth/register"
              >
                Inscription
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-3 border-l border-zinc-200 pl-3">
              <span className="hidden text-xs text-zinc-500 sm:inline">
                {user.email}
              </span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-700">
                {role || "USER"}
              </span>
              <Button
                className="flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                onClick={handleLogout}
              >
                <LogOut className="h-3 w-3" />
                Déconnexion
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
