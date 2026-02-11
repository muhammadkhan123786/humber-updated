'use client'
import React from 'react'
import { Trash, Trash2, X } from 'lucide-react'
import { PopupAnimation } from './Animation'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Are you absolutely sure?",
  message = "This action cannot be undone. This will permanently delete the ticket from the system."
}: DeleteConfirmModalProps) => {
  return (
    <PopupAnimation isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="mb-4 flex gap-3">
          <Trash2 size={24} className="text-red-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          
        </div>
        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="h-9 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="h-9 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </PopupAnimation>
  )
}

export default DeleteConfirmModal
