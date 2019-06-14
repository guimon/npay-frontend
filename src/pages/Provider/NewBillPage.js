import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import InputBase from '@material-ui/core/InputBase/index';
import TextField from '@material-ui/core/TextField/index';
import CircularProgress from '@material-ui/core/CircularProgress/index';
import Button from "@material-ui/core/Button/index";
import Typography from "@material-ui/core/Typography/index";

import ClearContainer from "../../components/ClearContainer";
import ProviderCustomerService from "../../services/ProviderCustomerService";
import ProviderService from "../../services/ProviderService";
import Notifier, { openSnackbar } from '../../components/Notifier';
import NewBillBar from "../../components/NewBillBar";
import FormRow from "../../components/FormRow";
import PhoneMaskedInput from "../../components/PhoneMaskedInput";
import MoneyMaskedInput from "../../components/MoneyMaskedInput";
import DateMaskedInput from "../../components/DateMaskedInput";
import DateUtils from "../../helpers/DateUtils";

const styles = theme => ({
  flex: {
    display: 'flex',
  },
  button: {
    margin: 2 * theme.spacing.unit,
  },
  buttonColor: {
    color: '#fff'
  },
});

class NewBillPage extends Component {
  state = {
    searching: false,
    saving: false,
    phone: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    street_address: '',
    address_complement: '',
    city: '',
    state: '',
    zip_code: '',
    customer_id: null,
    billed_amount: '',
    service_date: DateUtils.today(),
    external_bill_id: '',
  };

  clearForm = () => {
    this.setState({ phone: '', first_name: '', last_name: '', date_of_birth: '',
      street_address: '',  address_complement: '',  city: '', state: '',  zip_code: '',
      service_date: DateUtils.today() });
  };

  successfulFindCustomer = (response) => {
    this.setState({searching: false});

    this.setState({customer_id: response.data.data.id });

    this.setState({first_name: response.data.data.attributes.first_name});
    this.setState({last_name: response.data.data.attributes.last_name});
    this.setState({date_of_birth: DateUtils.decodeDate(response.data.data.attributes.date_of_birth)});

    this.setState({street_address: response.data.data.attributes.street_address || ''});
    this.setState({address_complement: response.data.data.attributes.address_complement || ''});
    this.setState({city: response.data.data.attributes.city || ''});
    this.setState({state: response.data.data.attributes.state || ''});
    this.setState({zip_code: response.data.data.attributes.zip_code || ''});
  };

  failedFindCustomer = (error, authCallback) => {
    this.setState({searching: false});
    this.setState({customer_id: '' });
    authCallback(this.props.history, error);
  };

  findCustomer = () => {
    if (this.state.phone.length === 10) {
      this.setState({searching: true});
      ProviderCustomerService.find(this.state.phone, this.successfulFindCustomer,
          this.failedFindCustomer);
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  canSave = () => {
    const {
      first_name, last_name, phone, date_of_birth, billed_amount, service_date
    } = this.state;

    if (first_name === '' || last_name === '' || phone === '' || date_of_birth === '' ||
        billed_amount === '' || service_date === '') {
      openSnackbar({ message: 'Please fill all fields with a *', variant: 'error', timeout: 3000 });
      return false;
    }

    return true;
  };

  submit = () => {
    if (this.canSave()) {
      let customer_payload = {
        customer: {
          id: this.state.customer_id,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          phone: this.state.phone,
          email: this.state.email,
          date_of_birth: DateUtils.encodeDate(this.state.date_of_birth),
          street_address: this.state.street_address,
          address_complement: this.state.address_complement,
          city: this.state.city,
          state: this.state.state,
          zip_code: this.state.zip_code
        }
      };

      this.setState({saving: true});
      ProviderCustomerService.save(customer_payload, this.successfulSaveCustomer,
          this.failedSaveCustomer);
    }
  };

  successfulSaveCustomer = (response) => {
    this.setState({customer_id: response.data.data.id });

    let bill_payload = {
      bill: {
        customer_id: this.state.customer_id,
        service_date: DateUtils.encodeDate(this.state.service_date),
        billed_amount: this.state.billed_amount * 100,
        external_bill_id: this.state.external_bill_id
      }
    };

    ProviderService.save(bill_payload, this.successfulSaveBill, this.failedSaveBill);
  };

  failedSaveCustomer = (error, authCallback) => {
    this.setState({saving: false});

    authCallback(this.props.history, error);
    openSnackbar({ message: 'Failed to save customer! Please try again later.', variant: 'error',
      timeout: 5000 });
  };

  successfulSaveBill = (response) => {
    openSnackbar({ message: 'Bill created successfully!', variant: 'success', timeout: 3000 });

    setTimeout(() => {
      this.props.history.push("/provider/bill/"+response.data.data.attributes.slug);
    }, 3000);
  };

  failedSaveBill = (error, authCallback) => {
    this.setState({saving: false});

    authCallback(this.props.history, error);
    openSnackbar({ message: 'Failed to save bill! Please try again later.', variant: 'error',
      timeout: 5000 });
  };

  render() {
    const { classes } = this.props;

    return (
      <ClearContainer>
        <NewBillBar title={`New Bill`} reset={this.clearForm}/>
        <FormRow label="Customer Phone *">
          <div className={classes.flex}>
            <TextField
                autoFocus
                fullWidth
                value={this.state.phone}
                onChange={this.handleChange('phone')}
                onBlur={this.findCustomer}
                InputProps={{
                  inputComponent: PhoneMaskedInput,
                  disableUnderline: true
                }}
            />
            {this.state.searching &&  <CircularProgress size={30} thickness={5} />}
          </div>
        </FormRow>
        <FormRow label="First name *">
          <InputBase
              fullWidth
              value={this.state.first_name}
              onChange={this.handleChange('first_name')}
              disabled={this.state.searching}/>
        </FormRow>
        <FormRow label="Last name *">
          <InputBase
              fullWidth
              value={this.state.last_name}
              onChange={this.handleChange('last_name')}
              disabled={this.state.searching}/>
        </FormRow>
        <FormRow label="Date of Birth *">
          <TextField
              value={this.state.date_of_birth}
              onChange={this.handleChange('date_of_birth')}
              InputProps={{
                inputComponent: DateMaskedInput,
                disableUnderline: true
              }}
              disabled={this.state.searching}
          />
        </FormRow>
        <FormRow label="Street address">
          <InputBase
              fullWidth
              value={this.state.street_address}
              onChange={this.handleChange('street_address')}
              disabled={this.state.searching}/>
        </FormRow>
        <FormRow label="Address Line 2">
          <InputBase
              fullWidth
              value={this.state.address_complement}
              onChange={this.handleChange('address_complement')}
              disabled={this.state.searching}/>
        </FormRow>
        <FormRow label="City">
          <InputBase
              fullWidth
              value={this.state.city}
              onChange={this.handleChange('city')}
              disabled={this.state.searching}>
          </InputBase>
        </FormRow>
        <FormRow label="State">
          <TextField
              select
              fullWidth
              value={this.state.state}
              InputProps={{ disableUnderline: true }}
              onChange={this.handleChange('state')}
              disabled={this.state.searching}>
            <MenuItem value="AL">Alabama</MenuItem>
            <MenuItem value="AK">Alaska</MenuItem>
            <MenuItem value="AZ">Arizona</MenuItem>
            <MenuItem value="AR">Arkansas</MenuItem>
            <MenuItem value="CA">California</MenuItem>
            <MenuItem value="CO">Colorado</MenuItem>
            <MenuItem value="CT">Connecticut</MenuItem>
            <MenuItem value="DE">Delaware</MenuItem>
            <MenuItem value="DC">District of Columbia</MenuItem>
            <MenuItem value="FL">Florida</MenuItem>
            <MenuItem value="GA">Georgia</MenuItem>
            <MenuItem value="HI">Hawaii</MenuItem>
            <MenuItem value="ID">Idaho</MenuItem>
            <MenuItem value="IL">Illinois</MenuItem>
            <MenuItem value="IN">Indiana</MenuItem>
            <MenuItem value="IA">Iowa</MenuItem>
            <MenuItem value="KS">Kansas</MenuItem>
            <MenuItem value="KY">Kentucky</MenuItem>
            <MenuItem value="LA">Louisiana</MenuItem>
            <MenuItem value="ME">Maine</MenuItem>
            <MenuItem value="MD">Maryland</MenuItem>
            <MenuItem value="MA">Massachusetts</MenuItem>
            <MenuItem value="MI">Michigan</MenuItem>
            <MenuItem value="MN">Minnesota</MenuItem>
            <MenuItem value="MS">Mississippi</MenuItem>
            <MenuItem value="MO">Missouri</MenuItem>
            <MenuItem value="MT">Montana</MenuItem>
            <MenuItem value="NE">Nebraska</MenuItem>
            <MenuItem value="NV">Nevada</MenuItem>
            <MenuItem value="NH">New Hampshire</MenuItem>
            <MenuItem value="NJ">New Jersey</MenuItem>
            <MenuItem value="NM">New Mexico</MenuItem>
            <MenuItem value="NY">New York</MenuItem>
            <MenuItem value="NC">North Carolina</MenuItem>
            <MenuItem value="ND">North Dakota</MenuItem>
            <MenuItem value="OH">Ohio</MenuItem>
            <MenuItem value="OK">Oklahoma</MenuItem>
            <MenuItem value="OR">Oregon</MenuItem>
            <MenuItem value="PA">Pennsylvania</MenuItem>
            <MenuItem value="RI">Rhode Island</MenuItem>
            <MenuItem value="SC">South Carolina</MenuItem>
            <MenuItem value="SD">South Dakota</MenuItem>
            <MenuItem value="TN">Tennessee</MenuItem>
            <MenuItem value="TX">Texas</MenuItem>
            <MenuItem value="UT">Utah</MenuItem>
            <MenuItem value="VT">Vermont</MenuItem>
            <MenuItem value="VA">Virginia</MenuItem>
            <MenuItem value="WA">Washington</MenuItem>
            <MenuItem value="WV">West Virginia</MenuItem>
            <MenuItem value="WI">Wisconsin</MenuItem>
            <MenuItem value="WY">Wyoming</MenuItem>
          </TextField>
        </FormRow>
        <FormRow label="Zip Code">
          <InputBase
              value={this.state.zip_code}
              onChange={this.handleChange('zip_code')}
              disabled={this.state.searching}/>
        </FormRow>
        <FormRow label="Bill amount *">
          <TextField
              value={this.state.billed_amount}
              onChange={this.handleChange('billed_amount')}
              InputProps={{
                inputComponent: MoneyMaskedInput,
                disableUnderline: true
              }}
          />
        </FormRow>
        <FormRow label="Date of service *">
          <TextField
              value={this.state.service_date}
              onChange={this.handleChange('service_date')}
              InputProps={{
                inputComponent: DateMaskedInput,
                disableUnderline: true
              }}
          />
        </FormRow>
        <FormRow label="Bill ID">
          <InputBase
              value={this.state.external_bill_id}
              onChange={this.handleChange('external_bill_id')}/>
        </FormRow>
        <Button
            className={classes.button}
            color="primary"
            variant="extendedFab"
            margin="normal"
            onClick={this.submit}
            disabled={this.state.saving}
        >
          <Typography className={classes.buttonColor}>Send to Customer</Typography>
        </Button>
        <Notifier />
      </ClearContainer>
    )
  }
}

export default withStyles(styles)(withRouter(NewBillPage));