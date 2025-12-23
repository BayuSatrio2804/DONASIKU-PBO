import Swal from 'sweetalert2';

/**
 * Custom SweetAlert utility for Donasiku
 */
export const showSuccess = (title, text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#00306C',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl px-6 py-2'
        }
    });
};

export const showError = (title, text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#00306C',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl px-6 py-2'
        }
    });
};

export const showConfirm = (title, text = '', confirmText = 'Ya', cancelText = 'Batal') => {
    return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl px-6 py-2',
            cancelButton: 'rounded-xl px-6 py-2'
        }
    });
};

export default {
    success: showSuccess,
    error: showError,
    confirm: showConfirm,
    fire: Swal.fire
};
