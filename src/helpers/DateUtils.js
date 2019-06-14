import moment from 'moment/moment';

export const DateUtils = {
  isToday,
  today,
  encodeDate,
  decodeDate,
};

export default DateUtils;

function isToday(date) {
  return moment().format("MMDDYYYY") === moment(date).format("MMDDYYYY");
}

function today() {
  return moment().format("MMDDYYYY");
}

// input => "04021980" ... output => "1980-04-02"
function encodeDate(date) {
  return date.substring(4,8) + "-" + date.substring(0,2) + "-" + date.substring(2,4);
}

// input => "1980-04-02" ... output => "04021980"
function decodeDate(date) {
  return date.substring(5,7) + "-" + date.substring(8,10) + "-" + date.substring(0,4);
}
