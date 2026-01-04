// src/components/admin/items/ItemActions.tsx
import React from 'react';
import type { AdminItem } from '../../../services/adminApi';
import { adminDeleteItem } from '../../../services/adminApi';

interface ItemActionsProps {
  item: AdminItem;
  onEdit: (item: AdminItem) => void;
  fetchItems: (page: number, category: string) => Promise<void>;
  page: number;
  categoryFilter: string;
  setError: (error: string) => void;
}

const ItemActions: React.FC<ItemActionsProps> = ({ 
  item, 
  onEdit, 
  fetchItems, 
  page, 
  categoryFilter, 
  setError 
}) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminDeleteItem(item.code!); 
      await fetchItems(page, categoryFilter);
    } catch (err: any) {
      setError(`Failed to deactivate ${item.code}: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 relative group">
      {/* Edit Button with Tooltip */}
      <div className="relative group/edit">
        <button
          onClick={() => onEdit(item)}
          className="p-2.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50/80 active:bg-amber-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-amber-200/50 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Edit item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        {/* Edit Tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover/edit:opacity-100 group-hover/edit:visible group-hover/edit:scale-100 transition-all duration-200 ease-out bg-amber-900/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xl border border-amber-800/50 whitespace-nowrap z-20 after:absolute after:-bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] after:border-t-amber-900/95">
          Edit Item
        </div>
      </div>
      {/* Deactivate Button - CROSSED CIRCLE */}
      <div className="relative group/deactivate">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50/80 active:bg-red-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-red-200/50 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          aria-label="Deactivate item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
        </button>
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover/deactivate:opacity-100 group-hover/deactivate:visible group-hover/deactivate:scale-100 transition-all duration-200 ease-out bg-red-900/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xl border border-red-800/50 whitespace-nowrap z-20 after:absolute after:-bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] after:border-t-red-900/95">
          Deactivate Item
        </div>
      </div>
    </div>
  );
};

export default ItemActions;
