'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';

const HealthCenterSignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const { Success, errorToast } = useToast();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await fetch('/api/healthcenter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signup',
          email: data.email,
          password: data.password,
          username: data.username,
          name: data.name,
          hcrn_hfc: data.hcrn_hfc,
          address: data.address,
          contact: data.contact,
          pincode: data.pincode,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Signup failed');

      Success('🎉 Account Created', 'Your health center account is now registered. Waiting for approval.');
      reset();
    } catch (error) {
      errorToast(`❌ Signup Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const baseInput =
    'pl-10 border rounded-lg w-full py-2 focus:outline-none focus:ring-2 transition duration-200';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const labelColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const inputBg = isDarkMode
    ? 'bg-gray-800 text-white border-gray-700 focus:ring-blue-500'
    : 'bg-white text-black border-gray-300 focus:ring-blue-400';
  const formBg = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const headingColor = isDarkMode ? 'text-white' : 'text-gray-800';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${formBg} p-6 rounded-xl shadow-lg max-w-md w-full mx-auto`}
    >
      <h2 className={`text-2xl font-semibold text-center ${headingColor}`}>
        Register Health Center
      </h2>

      {/* Username */}
      <div className="space-y-1">
        <label htmlFor="username" className={`text-sm font-medium ${labelColor}`}>
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="username"
            placeholder="Choose a username"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register('username', {
              required: 'Username is required',
              pattern: {
                value: /^[A-Za-z0-9_]{3,16}$/,
                message: '3-16 characters. Letters, numbers, underscores only.',
              },
            })}
          />
        </div>
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className={`text-sm font-medium ${labelColor}`}>
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className={`text-sm font-medium ${labelColor}`}>
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters required',
              },
            })}
          />
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="name" className={`text-sm font-medium ${labelColor}`}>
          Health Center Name
        </label>
        <input
          id="name"
          placeholder="ABC Health Center"
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* HCRN / HFC */}
      <div className="space-y-1">
        <label htmlFor="hcrn_hfc" className={`text-sm font-medium ${labelColor}`}>
          HCRN / HFC
        </label>
        <input
          id="hcrn_hfc"
          placeholder="HCRN001"
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
          {...register('hcrn_hfc', { required: 'HCRN/HFC is required' })}
        />
        {errors.hcrn_hfc && <p className="text-xs text-red-500">{errors.hcrn_hfc.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label htmlFor="address" className={`text-sm font-medium ${labelColor}`}>
          Address
        </label>
        <input
          id="address"
          placeholder="123 Main Street"
          className={`${baseInput} ${inputBg} ${placeholderColor}`}
          {...register('address', { required: 'Address is required' })}
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      {/* Contact */}
      <div className="space-y-1">
        <label htmlFor="contact" className={`text-sm font-medium ${labelColor}`}>
          Contact Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="contact"
            placeholder="9876543210"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register('contact', { required: 'Contact is required' })}
          />
        </div>
        {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
      </div>

      {/* Pincode */}
      <div className="space-y-1">
        <label htmlFor="pincode" className={`text-sm font-medium ${labelColor}`}>
          Pincode
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="pincode"
            placeholder="781001"
            className={`${baseInput} ${inputBg} ${placeholderColor}`}
            {...register('pincode', { required: 'Pincode is required' })}
          />
        </div>
        {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-medium"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Register Health Center
      </button>

      <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        By signing up, you agree to our Terms & Privacy Policy.
      </p>
    </form>
  );
};

export default HealthCenterSignUpForm;
