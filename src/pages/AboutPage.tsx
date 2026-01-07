import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-10">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[0.15em] text-gray-900 uppercase">
              {t('about.title')}
            </h1>
            <div className="mt-3 h-[2px] w-10 bg-gray-900 mx-auto" />
          </div>

          {/* Intro text */}
          <div className="space-y-4 text-center text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            <p>
              {t('about.intro1')}
            </p>
            <p>
              {t('about.intro2')}
            </p>
          </div>

          {/* Images row */}
          <div className="mt-8 flex justify-center">
            <div className="grid grid-cols-2 gap-6 sm:gap-16 justify-items-center">
              <div className="w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-sm">
                <img
                  src="/about-ring.jpg"
                  alt="Gold rings on hand"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-sm">
                <img
                  src="/about-necklace.jpg"
                  alt="Gold necklace in hand"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Values / small section */}
          <div className="mt-12 grid gap-8 sm:grid-cols-3 text-center text-sm sm:text-base">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 tracking-wide uppercase text-xs sm:text-sm">
                {t('about.craftsmanshipTitle')}
              </h3>
              <p className="text-gray-600">
                {t('about.craftsmanshipDesc')}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 tracking-wide uppercase text-xs sm:text-sm">
                {t('about.qualityTitle')}
              </h3>
              <p className="text-gray-600">
                {t('about.qualityDesc')}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 tracking-wide uppercase text-xs sm:text-sm">
                {t('about.experienceTitle')}
              </h3>
              <p className="text-gray-600">
                {t('about.experienceDesc')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
