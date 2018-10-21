import AwesomeQRCode from './awesome-qr';

export default ({ Vue }) => {
  Vue.directive('qrcode', {
    inserted(el, binding) {
      setTimeout(() => {
        if (binding.value) {
          new AwesomeQRCode().create({
            text: binding.value,
            size: 200,
            margin: 20,
            colorDark: '#000',
            colorLight: '#FFF',
            whiteMargin: 'white',
            bindElement: el.id,
            dotScale: 1,
          });
        }
      }, 100);
    },
  });
};

