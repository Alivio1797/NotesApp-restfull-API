import { toast } from 'sweetalert2';

class ToastNotification extends HTMLElement {
  constructor() {
    super();
  }

  show(message, type = 'success') {
    const toastConfig = {
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: type,
      title: message,
    };

  }
}

customElements.define('toast-notification', ToastNotification);
