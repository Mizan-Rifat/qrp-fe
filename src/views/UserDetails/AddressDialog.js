import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import GoogleAutoComplete from './GoogleAutoComplete';
import { Box, CircularProgress, TextField } from '@material-ui/core';
import useNotify from 'hooks/useNotify';
import { useEffect } from 'react';
import { updateUser } from 'redux/ducks/userDuck';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
  formDisable: {
    pointerEvents: 'none',
    opacity: 0.5
  },
  textField: {
    marginBottom: 16
  }
}));

export default function AddressDialog({ user, open, setOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    addressOne: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    latitude: '',
    longitude: ''
  });

  const [addressTwo, setAddressTwo] = useState(user.addressTwo);
  const [loading, setLoading] = useState(false);

  const toast = useNotify();

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };
  const handleSubmit = async () => {
    setLoading(true);
    dispatch(updateUser(user.id, { ...formData, addressTwo }))
      .then(() => {
        setLoading(false);
        setOpen(false);
        toast('Successfully updated.', 'success');
      })
      .catch(err => {
        setLoading(false);
        setOpen(false);
        toast(err.message, 'error');
      });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      addressOne: user.addressOne,
      addressTwo: user.addressTwo,
      city: user.city,
      province: user.province,
      postalCode: user.postalCode,
      country: user.country,
      latitude: user.location._latitude,
      longitude: user.location.longitude
    });
  }, [user]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      style={{ zIndex: 120 }}
    >
      {loading && (
        <Box position="absolute" top="45%" left="47%">
          <CircularProgress />
        </Box>
      )}
      <DialogTitle id="max-width-dialog-title">Update Address</DialogTitle>
      <DialogContent className={loading && classes.formDisable}>
        <GoogleAutoComplete setFormData={setFormData} />
        <TextField
          label="Apt/Suite #"
          value={addressTwo}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          onChange={e => {
            setAddressTwo(e.target.value);
          }}
        />
        <TextField
          label="Street Address"
          value={formData.addressOne}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          inputProps={{ readOnly: true }}
        />
        <TextField
          label="City"
          value={formData.city}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          inputProps={{ readOnly: true }}
        />
        <TextField
          label="Province"
          value={formData.province}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          inputProps={{ readOnly: true }}
        />
        <TextField
          label="Postal Code"
          value={formData.postalCode}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          inputProps={{ readOnly: true }}
        />
        <TextField
          label="Country"
          value={formData.country}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
          inputProps={{ readOnly: true }}
        />
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 16px 24px' }}>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
