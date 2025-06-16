'use client';

import ProtectedRoute from '@/components/ProtectedRoute'
import ProfileForm from '@/components/ProfileForm'
import { ToastContainer, useToast } from '@/components/Toast'

export default function ProfileSetup() {
  const { toasts, removeToast } = useToast()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Complete Your Profile
              </h1>
              <p className="text-neutral-600">
                Help us connect you with the right people by sharing more about yourself.
              </p>
            </div>

            <ProfileForm />
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ProtectedRoute>
  )
}