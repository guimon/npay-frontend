import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Button} from "@material-ui/core";

import SectionHeader from "./SectionHeader";
import FormRow from "./FormRow";
import Formatter from "../helpers/Formatter";
import FormRowFullWidth from "./FormRowFullWidth"
import Popup, { openPopup } from './Popup';
import LegalDocumentVersions from "../helpers/LegalDocumentVersions";

const styles = theme => ({
  value: {
    color: '#3D3E4D'
  },
  button: {
    color: '#fff'
  }
});

class ConsumerBillTabDetails extends Component {
  showDocument = (document) => {
    openPopup({ title: document.attributes.document_type, text: document.attributes.final_text });
  };

  showTerms = () => {
    fetch(LegalDocumentVersions.terms_of_use_path)
        .then((r) => r.text())
        .then(text  => {
          openPopup({ title: LegalDocumentVersions.terms_of_use_title, text: text});
        });
  };

  showPrivacyPolicy = () => {
    fetch(LegalDocumentVersions.privacy_policy_path)
        .then((r) => r.text())
        .then(text  => {
          openPopup({ title: LegalDocumentVersions.privacy_policy_title, text: text});
        });
  };

  showEsign = () => {
    fetch(LegalDocumentVersions.esign_path)
        .then((r) => r.text())
        .then(text  => {
          openPopup({ title: LegalDocumentVersions.esign_title, text: text});
        });
  };

  render() {
    const { classes, bill } = this.props;
    const { attributes } = bill;
    const { payments, credit_applications } = attributes;

    return (
      <React.Fragment>
        <SectionHeader label="Bill Details"/>
        <FormRow label="Status">
          <Typography className={classes.value}>
            {attributes.payment_status}
          </Typography>
        </FormRow>
        <FormRow label="Received at">
          <Typography className={classes.value}>
            {Formatter.formatDateTime(attributes.created_at)}
          </Typography>
        </FormRow>
        <FormRow label="Bill amount">
          <Typography className={classes.value}>
            {Formatter.formatMoney(attributes.billed_amount)}
          </Typography>
        </FormRow>
        { credit_applications.map((credit_application) => (
          <React.Fragment key={`credit_application${credit_application.id}`}>
            <SectionHeader label="Credit Application Details"/>
            <FormRow label="Application date">
              <Typography className={classes.value}>
                {Formatter.formatDateSimple(credit_application.attributes.submitted_at)}
              </Typography>
            </FormRow>
            <FormRow label="Status">
              <Typography className={classes.value}>
                {credit_application.attributes.status}
              </Typography>
            </FormRow>
            {credit_application.attributes.credit_offers.map((credit_offer) => (
              <React.Fragment key={`credit_offer${credit_offer}`}>
                <SectionHeader label="Offer Details"/>
                <FormRow label="Offer term">
                  <Typography className={classes.value}>
                    {credit_offer.attributes.term} months
                  </Typography>
                </FormRow>
                <FormRow label="Payment frequency">
                  <Typography className={classes.value}>
                    {credit_offer.attributes.payment_frequency}
                  </Typography>
                </FormRow>
                <FormRow label="Payment amount">
                  <Typography className={classes.value}>
                    {Formatter.formatMoney(credit_offer.attributes.payment_amount)}
                  </Typography>
                </FormRow>
                <FormRow label="Offer status">
                  <Typography className={classes.value}>
                    {credit_offer.attributes.status}
                  </Typography>
                </FormRow>
                <FormRow label="Accepted at">
                  <Typography className={classes.value}>
                    {credit_offer.attributes.taken_at && Formatter.formatDateSimple(credit_offer.attributes.taken_at)}
                  </Typography>
                </FormRow>
              </React.Fragment>
            )) }
            {credit_application.attributes.documents.length > 0 &&
            <React.Fragment>
              <SectionHeader label="Documents"/>
              {credit_application.attributes.documents.map((document) => (
                  <FormRowFullWidth key={`document${document.id}`}>
                    <Button component="span" color="primary" onClick={() => this.showDocument(document)}>
                      View {document.attributes.document_type}
                    </Button>
                  </FormRowFullWidth>
              ))}
            </React.Fragment>
            }
          </React.Fragment>
        )) }
        { payments.length > 0 &&
          <React.Fragment>
            <SectionHeader label="Payment History"/>
            { payments.map((payment) => (
              <FormRow label={Formatter.formatDateSimple(payment.attributes.paid_at)} key={`payment${payment.id}`}>
                <Typography>
                  {Formatter.formatMoney(payment.attributes.amount)}&nbsp;&nbsp;&nbsp;&nbsp;{payment.attributes.status}
                </Typography>
              </FormRow>
            )) }
          </React.Fragment>
        }
        <SectionHeader label="Legal Agreements"/>
        <FormRowFullWidth>
          <Button component="span" color="primary" onClick={() => this.showTerms()}>
            View Terms and Conditions
          </Button>
        </FormRowFullWidth>
        <FormRowFullWidth>
          <Button component="span" color="primary" onClick={() => this.showPrivacyPolicy()}>
            View Privacy Policy
          </Button>
        </FormRowFullWidth>
        <FormRowFullWidth>
          <Button component="span" color="primary" onClick={() => this.showEsign()}>
            View E-Sign Consent
          </Button>
        </FormRowFullWidth>
        <Popup />
      </React.Fragment>
    )
  }
}

ConsumerBillTabDetails.propTypes = {
  bill: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(ConsumerBillTabDetails));