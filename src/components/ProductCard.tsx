import type { Item } from "../services/api";
import { Link } from "react-router-dom";
import { pickLang } from '../utils/i18nHelpers';
import { useTranslation } from 'react-i18next';

interface Props {
  item: Item;
}

export default function ProductCard({ item }: Props) {
  const outOfStock = item.inStockCount <= 0;
  const { t } = useTranslation();

  return (
    <Link
      to={`/item/${item.code}`}
      className="group block bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col 
      scale-90 sm:scale-100"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-50">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="px-3 py-2 sm:px-4 sm:py-3 flex-1 flex flex-col">
        <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 mb-1">
          {pickLang(item.name, item.arabicName)}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 mb-1">
          {pickLang(item.categoryName, item.arabicCategoryName)}
          {item.karatName && (
            <>
              {' · '}
              <span dir="ltr">{item.karatName}K</span>
            </>
          )}
        </p>

        {/* Price / discount / stock */}
        <div className="mt-auto">
          <div className="flex items-center flex-wrap gap-1.5">
            {item.priceAfterDiscount != null ? (
              <>
                {/* Before discount (striked) */}
                <span
                  key="before-discount"
                  className="text-[11px] sm:text-xs md:text-sm text-gray-400 line-through"
                >
                  <span dir="ltr">
                    JD{item.priceBeforeDiscount.toFixed(3)}
                  </span>
                  {/* JD{item.priceBeforeDiscount.toFixed(3)} */}
                </span>

                {/* After discount (current price) */}
                <span
                  key="after-discount"
                  className="text-xs sm:text-sm md:text-base font-semibold text-gray-900"
                >
                  <span dir="ltr">
                    JD{item.priceAfterDiscount.toFixed(3)}
                  </span>
                  {/* JD{item.priceAfterDiscount.toFixed(3)} */}
                </span>

                {item.discountPercentage != null && (
                  <span
                    key="discount"
                    className="text-[11px] text-red-500 font-medium"
                  >
                    <span dir="ltr">
                      -{item.discountPercentage}%
                    </span>
                    {/* -{item.discountPercentage}% */}
                  </span>
                )}
              </>
            ) : (
              // No discount
              <span
                key="price"
                className="text-xs sm:text-sm md:text-base font-semibold text-gray-900"
              >
                <span dir="ltr">
                  JD{item.priceBeforeDiscount.toFixed(3)}
                </span>
                {/* JD{item.priceBeforeDiscount.toFixed(3)} */}
              </span>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            {outOfStock ? (
              <span key="out-of-stock" className="text-red-500">{t('common.outOfStock')}</span>
            ) : (
              <span key="in-stock">{t('common.inStock')}</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
