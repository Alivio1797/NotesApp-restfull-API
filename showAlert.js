import Swal from 'sweetalert2';

const showAlert = {
  success: (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  error: (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  },

  info: (message) => {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  },
};

export default showAlert;
