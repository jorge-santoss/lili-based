// front/src/page/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold text-emerald-700">
            Le Repas de Lili
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/login" className="text-zinc-700 hover:text-emerald-700">
              Se connecter
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        <section className="mb-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold text-zinc-900">
              Des repas à 1€ pour toutes et tous.
            </h1>
            <p className="mb-4 text-sm text-zinc-700">
              Le Repas de Lili connecte restaurants solidaires, associations et
              bénéficiaires pour rendre accessible une alimentation saine,
              locale et durable.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/register?type=resto"
                className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
              >
                Je suis un restaurant
              </Link>
              <Link
                to="/register?type=asso"
                className="rounded-md border border-emerald-600 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Je suis une association
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-emerald-800">
              Le programme des repas à 1€
            </h2>
            <p className="mb-2 text-xs text-zinc-700">
              La Petite Lili fédère un réseau de restaurateurs engagés qui
              proposent des repas équilibrés à 1€ pour les publics en
              précarité, en partenariat avec les associations de terrain.
            </p>
            <p className="text-xs text-zinc-700">
              Votre espace en ligne permet de gérer les réservations, suivre les
              repas servis et accompagner les bénéficiaires au quotidien.
            </p>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Un écosystème solidaire
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-emerald-700">
                Restaurants
              </h3>
              <p className="text-xs text-zinc-700">
                Vous proposez des repas à 1€, principalement issus de produits
                locaux et de saison, et vous suivez les réservations directement
                dans votre espace.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-emerald-700">
                Associations
              </h3>
              <p className="text-xs text-zinc-700">
                Vous inscrivez vos bénéficiaires, gérez les droits aux repas et
                réservez dans les restaurants partenaires de votre territoire.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-emerald-700">
                Administration
              </h3>
              <p className="text-xs text-zinc-700">
                Vous suivez les repas servis, les acteurs engagés et les
                statistiques du programme pour piloter le déploiement national.
              </p>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Un impact concret
          </h2>
          <div className="grid gap-4 md:grid-cols-4 text-center">
            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <div className="text-base font-bold text-emerald-700">
                +10 000
              </div>
              <div className="text-xs text-zinc-600">repas à 1€ servis</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <div className="text-base font-bold text-emerald-700">
                +90
              </div>
              <div className="text-xs text-zinc-600">
                associations partenaires
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <div className="text-base font-bold text-emerald-700">
                +130
              </div>
              <div className="text-xs text-zinc-600">
                chef.fe.s engagés
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <div className="text-base font-bold text-emerald-700">
                +350
              </div>
              <div className="text-xs text-zinc-600">adhérents</div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mb-4 rounded-xl bg-emerald-700 px-4 py-6 text-white">
          <h2 className="mb-2 text-lg font-semibold">
            Rejoindre le réseau Le Repas de Lili
          </h2>
          <p className="mb-3 text-sm text-emerald-100">
            Que vous soyez restaurateur, association ou collectivité, vous
            pouvez contribuer à rendre l’alimentation de qualité accessible à
            toutes et tous.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              to="/register?type=resto"
              className="rounded-md bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Devenir restaurant partenaire
            </Link>
            <Link
              to="/register?type=asso"
              className="rounded-md border border-white px-4 py-2 font-semibold text-white hover:bg-emerald-600"
            >
              Devenir association partenaire
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
