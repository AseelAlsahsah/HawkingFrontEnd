import React from 'react';
import type { AdminKarat } from '../../../services/api';
import { adminDeleteKarat } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';

interface KaratActionsProps {
  karat: AdminKarat;
  onEdit: (karat: AdminKarat) => void;
  fetchKarats: (page: number) => Promise<void>;
  page: number;
  setError: (error: string) => void;
}

const KaratActions: React.FC<KaratActionsProps> = ({
  karat,
  onEdit,
  fetchKarats,
  page,
  setError
}) => {
  const { addToast } = useToast();
  const [deleting, setDeleting] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDelete = async () => {
    setShowDeleteModal(true); 
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    
    try {
      setDeleting(true);
      await adminDeleteKarat(karat.id);
      addToast(`"${karat.displayName}" deleted successfully.`, 'success');
      await fetchKarats(page);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.response?.data?.status?.description || err.message || 'Failed to delete karat');
      addToast('Failed to delete karat', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
    <div className="flex items-center justify-center gap-2 relative group">
      {/* Edit Button with Tooltip */}
      <div className="relative group/edit">
        <button
          onClick={() => onEdit(karat)}
          className="p-2.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50/80 active:bg-amber-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Edit karat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        {/* Edit Tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover/edit:opacity-100 group-hover/edit:visible group-hover/edit:scale-100 transition-all duration-200 ease-out bg-amber-900/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xl border border-amber-800/50 whitespace-nowrap z-20 after:absolute after:-bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] after:border-t-amber-900/95">
          Edit Karat
        </div>
      </div>

      {/* Delete Button with Tooltip */}
      <div className="relative group/delete">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50/80 active:bg-red-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-red-200/50 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          aria-label="Delete karat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        
        {/* Delete Tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover/delete:opacity-100 group-hover/delete:visible group-hover/delete:scale-100 transition-all duration-200 ease-out bg-red-900/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xl border border-red-800/50 whitespace-nowrap z-20 after:absolute after:-bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] after:border-t-red-900/95">
          Delete Karat
        </div>
      </div>
    </div>
    {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white/95  rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 text-center">
              {/* Warning Icon */}
              <div className="w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-black text-gray-900 mb-3">
                Delete Karat ({karat.displayName})?
              </h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                This action <span className="font-bold text-red-600">CANNOT</span> be undone. 
                It will be permanently removed from your system.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl  text-lg border border-red-600/50"
                >
                Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 font-bold py-1 px-4 rounded-xl text-lg border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KaratActions;
