import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 pt-16 md:pt-16">
        <section className="relative min-h-[70vh] md:h-[80vh] md:min-h-[500px] pt-10 sm:pt-16">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/hero-jewelry.jpg')",
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Centered content */}
          <div className="relative h-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 text-center text-white mt-4 sm:mt-0">
            <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 backdrop-blur-sm">
              <p className="tracking-[0.25em] sm:tracking-[0.35em] text-[10px] sm:text-xs uppercase mb-4">
                {t('home.heroTagline')}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-snug">
                {t('home.heroTitle')}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-100 mb-6 sm:mb-8">
                {t('home.heroDescription')}
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gold-500 text-gray-700 text-sm sm:text-base font-semibold tracking-wide hover:bg-gold-600 transition"
              >
                {t('home.heroCta')}
              </Link>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid gap-8 md:grid-cols-3 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                {t('home.qualityTitle')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('home.qualityDescription')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                {t('home.customTitle')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('home.customDescription')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                {t('home.reservationTitle')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('home.reservationDescription')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
