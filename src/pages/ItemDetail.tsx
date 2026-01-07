import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchItemByCode, type ItemDetail } from "../services/api";
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../utils/i18nHelpers';

export default function ItemDetail() {
  const { code } = useParams<{ code: string }>();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!code) return;
    let active = true;

    fetchItemByCode(code)
      .then((data) => {
        if (active) setItem(data);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load item details");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [code]);

  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    if (!item || isOutOfStock) return;

    const itemName = pickLang(item.name, item.arabicName);

    addToCart({
      id: item.id,
      code: item.code,
      name: itemName,
      imageUrl: item.imageUrl,
      price: priceAfterDiscount
    }, quantity);

    addToast(t('item.addedToCart', { count: quantity, name: itemName }), 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gold-50 to-amber-50">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center p-12 max-w-md">
            <div className="text-4xl mb-4">😢</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{error || t('item.notFound')}</h2>
            <Link to="/collections" className="inline-flex items-center px-6 py-3 bg-gold-600 text-white font-semibold rounded-xl hover:bg-gold-700 transition">
              {t('item.browseCollections')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Price calculations
  const hasDiscount = item.discountPercentage !== null && item.discountPercentage > 0;
  const priceBeforeDiscount = item.priceBeforeDiscount;
  const priceAfterDiscount = item.priceAfterDiscount ?? priceBeforeDiscount;

  const isOutOfStock = item.inStockCount <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-gold-700 font-medium transition">{t('navbar.home')}</Link></li>
              <li>/</li>
              <li>
                <Link to="/collections" className="hover:text-gold-700 font-medium transition">{t('navbar.collections')}</Link>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-900">{pickLang(item.name, item.arabicName)}</li>
            </ol>
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Product Image - Much smaller on mobile */}
            <div>
              <div className="relative w-full max-w-sm mx-auto aspect-[3/4] lg:aspect-[4/5] lg:max-w-none bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              {/* Product Title & Pricing */}
              <div className="space-y-1">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                    {pickLang(item.name, item.arabicName)}
                  </h1>
                  <p className="text-lg text-gray-600">{pickLang(item.category.name, item.category.arabicName)}</p>
                </div>

                {/* Pricing Section */}
                <div className="bg-white/80 p-3 rounded-2xl border shadow-sm">
                  <div>
                    {hasDiscount && item.priceAfterDiscount !== null ? (
                      <>
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl lg:text-4xl font-semibold text-gold-600">
                            <span dir="ltr">
                              ${priceAfterDiscount.toFixed(3)}
                            </span>
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            <span dir="ltr">
                              ${priceBeforeDiscount.toFixed(3)}
                            </span>
                          </span>
                        </div>
                        {/* <div className="flex items-center text-gold-700 font-medium bg-gold-100 px-3 py-1 rounded-full w-fit text-sm">
                          <span>{item.discountPercentage}% off factory price</span>
                        </div> */}
                      </>
                    ) : (
                      <div className="text-3xl lg:text-4xl font-semibold text-gold-600">
                        <span dir="ltr">
                          ${priceBeforeDiscount.toFixed(3)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 p-3 rounded-xl border shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t('item.goldBreakdown')}</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('item.goldPrice')}</span>
                      <span className="font-mono">
                        <span dir="ltr">
                          ${item.goldPricePerGram.toFixed(3)}/g
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('item.weight')}</span>
                      <span className="font-mono font-semibold">
                        <span dir="ltr">
                          {item.weight}g
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200">
                      <span className="text-gray-600">{t('item.karat')}</span>
                      <span className="font-semibold">{item.karat.displayName}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t('item.factoryAndDiscount')}</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('item.factoryPrice')}</span>
                      <span className="font-mono">
                        <span dir="ltr">
                          ${item.factoryPrice.toFixed(3)}
                        </span>
                      </span>
                    </div>
                    {hasDiscount ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('item.discount')}</span>
                          <span className="font-mono text-gold-600">
                            <span dir="ltr">
                              −{item.discountPercentage}%
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-200">
                          <span className="text-gray-900 font-semibold">{t('item.factoryTotal')}</span>
                          <span className="font-mono font-bold">
                            <span dir="ltr">
                              ${((item.factoryPrice * item.weight) * (1 - item.discountPercentage / 100)).toFixed(3)}
                            </span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between pt-1 border-t border-gray-200">
                        <span className="text-gray-900 font-semibold">{t('item.factoryTotal')}</span>
                        <span className="font-mono font-bold">
                          <span dir="ltr">
                            ${((item.factoryPrice * item.weight)).toFixed(3)}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-white/80 p-3 rounded-2xl border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('item.productInformation')}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 w-10">{t('item.code')}:</span>
                    <span className="font-mono px-3 py-1 text-xs font-semibold ml-3">
                      {item.code}
                    </span>
                  </div>
                  {item.description && (
                    <div className="pt-1 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{pickLang(item.description, item.arabicDescription)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Simple Quantity & Add to Cart */}
              {/* Quantity & Add to Cart */}
              <div className="bg-white/80 p-3 rounded-2xl border shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-semibold text-gray-900">{t('item.quantity')}</span>
                  {isOutOfStock && (
                    <span className="text-sm font-medium text-red-600">{t('common.outOfStock')}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <div className="w-16 text-center">
                    <span className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                      {quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-6 font-semibold rounded-xl transition text-base disabled:cursor-not-allowed
                    disabled:bg-gray-300 disabled:text-gray-500
                    bg-gold-600 text-white hover:bg-gold-700"
                >
                  {isOutOfStock
                    ? t('common.outOfStock')
                    : t('item.addToCartWithPrice', {
                      price: (priceAfterDiscount * quantity).toFixed(3),
                    })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
