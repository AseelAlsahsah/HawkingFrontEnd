import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from 'react-i18next';

export default function GetInTouch() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero – Get In Touch */}
        <section className="relative min-h-[45vh] sm:min-h-[50vh] md:min-h-[55vh] pt-24 sm:pt-28">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/contact2.jpg')",
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Centered content */}
          <div className="relative h-full max-w-3xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 text-center text-white">
            <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10 backdrop-blur-sm">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 leading-snug">
                {t('contact.heroTitle')}
              </h1>
              <div className="mt-3 h-px w-12 bg-gradient-to-r from-amber-400 via-amber-200 to-transparent mx-auto" />
              <p className="text-xs sm:text-sm md:text-base text-gray-100 mb-0 sm:mb-1">
                {t('contact.heroDescription')}
              </p>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-20">
          <div className="grid gap-10 sm:gap-12 md:grid-cols-3 md:gap-10 text-slate-900">
            {/* Address */}
            <div className="flex flex-col items-center text-center space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">
                {t('contact.addressTitle')}
              </h2>
              <div className="h-0.5 w-10 bg-amber-500 rounded-full" />
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                {t('contact.addressLine1')}
                <br />
                {t('contact.addressLine2')}
                <br />
                {t('contact.addressLine3')}
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center text-center space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">{t('contact.contactTitle')}</h2>
              <div className="h-0.5 w-10 bg-amber-500 rounded-full" />
              <div className="space-y-1.5 text-sm sm:text-base text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">{t('contact.phoneLabel')}:</span>
                  <br />
                  <span dir="ltr" className="unicode-bidi-plaintext">
                    +962 79 255 3120
                  </span>
                </p>
              </div>
            </div>

            {/* Opening hours */}
            <div className="flex flex-col items-center text-center space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">{t('contact.hoursTitle')}</h2>
              <div className="h-0.5 w-10 bg-amber-500 rounded-full" />
              <div className="space-y-2 text-sm sm:text-base text-slate-600 w-full max-w-xs">
                <div className="flex justify-center gap-2 sm:gap-3">
                  <span>{t('contact.weekdays')}</span>
                  <span className="font-medium text-slate-800">
                    {t('contact.weekdaysHours')}
                  </span>
                </div>
                <div className="flex justify-center gap-2 sm:gap-3">
                  <span>{t('contact.friday')}</span>
                  <span className="font-medium text-slate-800">
                    {t('contact.fridayHours')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
