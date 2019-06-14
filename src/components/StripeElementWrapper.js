import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

import StripeInput from './StripeInput'

export default class extends PureComponent {
  static displayName = 'StripeElementWrapper'

  static propTypes = {
    component: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  };

  state = {
    focused: false,
    empty: true,
    error: false,
  };

  handleBlur = () => {
    this.setState({ focused: false })
  };

  handleFocus = () => {
    this.setState({ focused: true })
  };

  handleChange = changeObj => {
    this.setState({
      error: changeObj.error,
      empty: changeObj.empty,
    })
  };

  render() {
    const { component, label, color } = this.props;
    const { focused, empty, error } = this.state;

    return (
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel
                focused={focused}
                shrink={focused || !empty}
                error={!!error}>
              {label}
            </InputLabel>
            <Input
                fullWidth
                inputComponent={StripeInput}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                inputProps={{ component, color: color }}
            />
          </FormControl>
        </div>
    )
  }
}
