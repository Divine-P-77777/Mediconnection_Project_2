// hooks/use-toast.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useToast = () => {
  const Success = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
  };

  const errorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
  };

  const warn = (message) => {
    toast.warn(message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
  };

  const info = (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
  };

  return { Success, errorToast, warn, info };
};
