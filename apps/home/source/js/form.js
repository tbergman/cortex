import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

function reactForm() {
  return (
    <div>
      <TextField
        required
        id="firstName"
        label="Required"
        defaultValue="First Name"
        className={classes.textField}
        margin="normal"
      />

      <TextField
        required
        id="lastName"
        label="Required"
        defaultValue="Last Name"
        className={classes.textField}
        margin="normal"
      />

      <TextField
        required
        id="emailAddress"
        label="Required"
        defaultValue="example@email.com"
        className={classes.textField}
        margin="normal"
      />

      <TextField
        required
        id="zipCode"
        label="Number"
        defaultValue="10017"
        type="number"
        className={classes.textField}
        margin="normal"
      />

      <Button variant="raised" color="primary">
      Submit
      </Button>
    </div>
  );
}

ReactDOM.render(
  <reactForm />,
  document.querySelector("#formApp")
);