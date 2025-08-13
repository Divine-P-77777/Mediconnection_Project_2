'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function ForgotPasswordForm({
  className = '',
  direction = 'col',
  cancelText = 'Cancel',
  submitText = 'Send Reset Instructions',
  email,
  isEmailReadOnly,
}) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { forgotPassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await forgotPassword(data.email);
      toast.success('Password reset instructions have been sent to your email.');
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-${direction} gap-2 items-start ${className}`}>
      <Button
        variant="ghost"
        className="px-4 py-1 rounded-xl text-sm dark:text-gray-300"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Forgot password?
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-2"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-sm bg-white dark:bg-gray-900"
            >
              <div className="space-y-2">
                <label htmlFor="reset-email" className="sr-only">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    id="reset-email"
                    type="email"
                    defaultValue={email}
                    readOnly={isEmailReadOnly}
                    placeholder="Enter your email"
                    className="pl-10 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center gap-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className="text-sm dark:border-gray-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  {cancelText}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
