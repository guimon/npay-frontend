import moment from 'moment/moment';

export const Formatter = {
  formatMoney,
  formatTime,
  formatDateVerbose,
  formatDateSimple,
  formatDate,
  formatDateTime,
  formatDateTimeSimple,
  formatPhone,
};

export default Formatter;

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount/100); // cents
}

function formatPhone(phone) {
  if (phone.length !== 10) return phone;

  return "(" + phone.substring(0,3) + ") " + phone.substring(3,6) + "-" + phone.substring(6,10);
}

function formatTime(datetime) {
  return moment(datetime).format("hh:mma");
}

function formatDateSimple(datetime) {
  return moment(datetime).format("MMM Do YYYY");
}

function formatDate(datetime) {
  return moment(datetime).format("MMM Do, YY");
}

function formatDateVerbose(datetime) {
  return moment(datetime).format("dddd, MMM Do, YYYY");
}

function formatDateTime(datetime) {
  return moment(datetime).format("MMM Do YYYY - hh:mma");
}

function formatDateTimeSimple(datetime) {
  return moment(datetime).format("MM/DD hh:mm");
}
