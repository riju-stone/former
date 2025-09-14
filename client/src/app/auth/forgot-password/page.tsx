import React from 'react'

function ForgotPasswordPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className="text-5xl font-bold mb-8">Reset your password</div>
      <div className="w-[30%] flex flex-col items-center justify-center gap-2 my-4">
        <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded px-2 py-1 mb-2" />
        <button className="w-full bg-blue-500 text-white rounded px-2 py-1">Send reset link</button>
      </div>
    </div>
  )
}

export default ForgotPasswordPage