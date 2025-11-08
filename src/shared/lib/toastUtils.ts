import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export function toastSuccess(message: string, options?: ToastOptions) {
    toast.success(message, { ...defaultOptions, ...options });
}

export function toastError(message: string, options?: ToastOptions) {
    toast.error(message, { ...defaultOptions, ...options });
}

export function toastInfo(message: string, options?: ToastOptions) {
    toast.info(message, { ...defaultOptions, ...options });
}

export function toastWarn(message: string, options?: ToastOptions) {
    toast.warn(message, { ...defaultOptions, ...options });
}
