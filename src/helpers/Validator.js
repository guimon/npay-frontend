import moment from 'moment/moment';

export const Validator = {
  validDateOfBirth,
  validZipCode
};

export default Validator;

function validZipCode(zip_code) {
  if ((zip_code.length === 0) || (zip_code.length === 5) || (zip_code.length === 9)) {
    return true;
  }

  return false;
}

function validDateOfBirth(date_of_birth) {
  if (date_of_birth.length === 0)  {
    return true;
  }

  if (date_of_birth.length === 8) {
    let date = moment(date_of_birth, "MMDDYYYY");

    let valid = date.isValid();
    let tooOld = date.isBefore('1900-01-01');
    let inFuture = date.isAfter(moment());

    return valid && !tooOld && !inFuture;
  }

  return false;
}
