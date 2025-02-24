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

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  timeEl.daysEl.textContent = addZero(days);
  timeEl.hoursEl.textContent = addZero(hours);
  timeEl.minutesEl.textContent = addZero(minutes);
  timeEl.secondsEl.textContent = addZero(seconds);
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

  timerInterval = setInterval(() => {
    const remainingTime = selectedDate - new Date();
    const time = convertMs(remainingTime);

    updateTimer(time);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      iziToast.success({
        title: 'Finished',
        message: 'The countdown is complete!',
      });
      dateInput.disabled = false;
      startBtn.disabled = true;
    }
  }, 1000);

  dateInput.disabled = true;
  startBtn.disabled = true;
});

dateInput.addEventListener('change', function (e) {
  selectedDate = new Date(e.target.value);
});
