"use client";

import ForgotPasswordForm from "../_components/ForgetPasswordForm";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 via-purple-500 to-indigo-500 relative overflow-hidden">
      {/* Header Curve */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-700 to-indigo-600 rounded-b-[50%] flex items-center justify-center">
        <h1 className="text-white text-2xl font-bold tracking-wide">UniGuide</h1>
      </div>

      {/* Form */}
      <ForgotPasswordForm />
    </div>
  );
}
