import React from 'react';
import type { AdminItem } from '../../../services/adminApi';
import { adminDeactivateItem, adminDeleteItem } from '../../../services/adminApi';
import { useTranslation } from 'react-i18next';
import ModalPortal from '../../ModalPortal';

interface ItemActionsProps {
  item: AdminItem;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: (item: AdminItem) => void;
  fetchItems: (page: number, category: string) => Promise<void>;
  page: number;
  categoryFilter: string;
  setError: (error: string) => void;
}

const ItemActions: React.FC<ItemActionsProps> = ({
  item,
  open,
  onToggle,
  onClose,
  onEdit,
  fetchItems,
  page,
  categoryFilter,
  setError
}) => {
  const [deactivating, setDeactivating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { t } = useTranslation();

  const getErrorMessage = (err: any, fallback = 'Something went wrong') =>
    err?.response?.data?.message ||
    err?.response?.data?.status?.description ||
    err?.message ||
    fallback;

  const handleDeactivate = async () => {
    try {
      setDeactivating(true);
      await adminDeactivateItem(item.code!);
      await fetchItems(page, categoryFilter);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to deactivate'));
    } finally {
      setDeactivating(false);
    }
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);

    try {
      setDeleting(true);
      await adminDeleteItem(item.id!);
      await fetchItems(page, categoryFilter);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to delete item'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Actions Dropdown */}
      <div className="relative flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Item actions"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>

        {open && (
          <div
            className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {t('common.edit')}
            </button>

            <button
              onClick={async () => {
                onClose();
                await handleDeactivate();
              }}
              disabled={deactivating}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {t('common.deactivate')}
            </button>

            <button
              onClick={() => {
                onClose();
                setShowDeleteModal(true);
              }}
              disabled={deleting}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {t('common.delete')}
            </button>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-3">
                  {t('admin.items.actions.confirmTitle', { code: item.code })}
                </h3>

                <p className="text-sm text-gray-500 mb-8">
                  {t('admin.items.actions.confirmText')}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
                  >
                    {t('admin.items.actions.confirmDelete')}
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-xl"
                  >
                    {t('admin.items.actions.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default ItemActions;
