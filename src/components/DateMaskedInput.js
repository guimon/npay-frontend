import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function DateMaskedInput(props) {
  const { inputRef, onChange, ...other } = props;

  return (
      <NumberFormat
          {...other}
          getInputRef={inputRef}
          onValueChange={values => {
            onChange({
              target: {
                value: values.value,
              },
            });
          }}
          format="##/##/####"
          placeholder="MM/DD/YYYY"
          mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
      />
  );
}

DateMaskedInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateMaskedInput;