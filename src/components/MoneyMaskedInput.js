import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function MoneyMaskedInput(props) {
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
          thousandSeparator
          prefix="$"
      />
  );
}

MoneyMaskedInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MoneyMaskedInput;