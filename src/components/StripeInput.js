import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    width: '100%',
    padding: '6px 0 7px',
    cursor: 'text',
  }
});

class StripeInput extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
  };

  render() {
    const {
      classes: c,
      component: Component,
      onFocus,
      onBlur,
      onChange,
      color,
    } = this.props;

    return (
        <Component
            className={c.root}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            placeholder=""
            style={{
              base: {
                color: color,
              },
            }}
        />
    )
  }
}

export default withStyles(styles)(StripeInput);