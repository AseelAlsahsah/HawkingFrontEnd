import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { fetchItems, adminFetchCategories, type AdminCategory, type Item, type ItemSearchResponse } from "../services/api";
import Pagination from "../components/Pagination";
import { useTranslation } from 'react-i18next';
import { pickLang } from '../utils/i18nHelpers';

interface CategoryOption {
  id: string;
  label: string;
  backendName?: string;
}

export default function Collections() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const ALL = '__ALL__';
  const [category, setCategory] = useState<string>(ALL);
  const [page, setPage] = useState<number>(0);
  const [data, setData] = useState<ItemSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { t } = useTranslation();
  const size = 12;

  useEffect(() => {
    adminFetchCategories({ size: 100 })
      .then((res) => {
        setCategories(res.content);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchItems({
      page,
      size,
      // categoryName: category === "All Products" ? undefined : category,
      categoryName: category === ALL ? undefined : categoryList.find(c => c.id === category)?.backendName,
    })
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError("Failed to load products. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, size, category]);

  const totalProducts = data?.page.totalElements ?? 0;
  const totalPages = data?.page.totalPages ?? 1;

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(0); // reset to first page when changing filter
  };

  const categoryList: CategoryOption[] = [
    {
      id: ALL,
      label: t('collections.allProducts'),
    },
    ...categories.map(cat => ({
      id: cat.id.toString(),
      label: pickLang(cat.name, cat.arabicName),
      backendName: cat.name,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-16 md:pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 mb-3">
            <span className="hover:text-gold-600 cursor-pointer">{t('navbar.home')}</span>
            <span className="mx-1">/</span>
            <span className="hover:text-gold-600 cursor-pointer">{t('navbar.collections')}</span>
            <span className="mx-1">/</span>
            <span className="text-gray-700">
              {category === ALL ? t('collections.allProducts') : categoryList.find(c => c.id === category)?.label}
            </span>
          </div>

          {/* Header row: title + count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              {category === ALL ? t('collections.allProducts') : categoryList.find(c => c.id === category)?.label}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 sm:mt-0">
              {loading ? (
                t('common.loading')
              ) : (
                <span dir="ltr">
                  {t('collections.productsCount', { count: totalProducts })}
                </span>
              )}
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categoriesLoading ? (
              <div className="px-3 py-1.5 text-xs md:text-sm text-gray-500">
                {t('common.loading')}
              </div>
            ) : (
              categoryList.map(cat => {
                const isActive = cat.id === category;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={
                      "px-3 py-1.5 text-xs md:text-sm border rounded-md transition " +
                      (isActive
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400")
                    }
                  >
                    {cat.label}
                  </button>
                );
              })
            )}
          </div>

          {/* Grid */}
          {error && (
            <div className="text-sm text-red-500 mb-4">
              {error}
            </div>
          )}

          {loading && !data && (
            <div className="text-sm text-gray-500">Loading products…</div>
          )}

          {data && data.content.length === 0 && !loading && (
            <div className="text-sm text-gray-500">{t('collections.noProducts')}</div>
          )}

          {data && data.content.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {data.content.map((item: Item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
