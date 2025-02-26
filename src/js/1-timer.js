import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateInput = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');

const timeEl = {
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]')
};

let selectedDate;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        titleColor:'white',
        messageColor:'white',
        backgroundColor:  '#ef4040',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      selectedDate = userSelectedDate;
    }
  },
};

flatpickr(dateInput, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % day % hour) / minute);
  const seconds = Math.floor((ms % day % hour % minute) / second);

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
}

function updateTimer({ days, hours, minutes, seconds }) {
  timeEl.daysEl.textContent = days;
  timeEl.hoursEl.textContent = hours;
  timeEl.minutesEl.textContent = minutes;
  timeEl.secondsEl.textContent = seconds;
}

let timerInterval;

startBtn.addEventListener('click', function () {
  if (!selectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date!',
    });
    return;
  }

  dateInput.disabled = true;
  startBtn.disabled = true;

  timerInterval = setInterval(() => {
    const remainingTime = selectedDate - new Date();
    const time = convertMs(remainingTime);

    updateTimer(time);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      updateTimer({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      });
      iziToast.success({
        title: 'Finished',
        message: 'The countdown is complete!',
      });
      dateInput.disabled = false;
    }
  }, 1000);
});

dateInput.addEventListener('change', function (e) {
  selectedDate = new Date(e.target.value);
});
