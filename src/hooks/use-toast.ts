import { useCallback } from "react";
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastMessage = string;

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  theme: "colored",
};

export const useToast = () => {
  const success = useCallback((message: ToastMessage): void => {
    toast.success(message, defaultOptions);
  }, []);

  const errorToast = useCallback((message: ToastMessage): void => {
    toast.error(message, defaultOptions);
  }, []);

  const warn = useCallback((message: ToastMessage): void => {
    toast.warn(message, defaultOptions);
  }, []);

  const info = useCallback((message: ToastMessage): void => {
    toast.info(message, defaultOptions);
  }, []);

  return { success, errorToast, warn, info };
};
