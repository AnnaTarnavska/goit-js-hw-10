import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import pathSuccessIcon from "../img/sucсess.svg";
import pathErrorIcon from "../img/error.svg";


const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const stateRadios = form.querySelectorAll('input[name="state"]');

form.addEventListener('submit', function (e) {
  e.preventDefault(); 

  const delay = parseInt(delayInput.value);
  const selectedState = [...stateRadios].find(radio => radio.checked);
  
  if (!selectedState) {
    iziToast.error({
      title: 'Error',
      message: 'Please select a state.',
      position: 'topRight',
      titleColor:'#fff',
      messageColor: '#fff',
      backgroundColor: '#ef4040',
      image: pathErrorIcon,
      imageWidth: 24,
      imageHeight: 24,
    });
    return; 
  }

  const stateValue = selectedState.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (stateValue === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message:`Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        titleColor:'#fff',
        messageColor: '#fff',
        backgroundColor: '#59a10d',
        image: pathSuccessIcon,
      imageWidth: 24,
      imageHeight: 24,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
        titleColor:'#fff',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        image: pathErrorIcon,
      imageWidth: 24,
      imageHeight: 24,
      });
    });
});

