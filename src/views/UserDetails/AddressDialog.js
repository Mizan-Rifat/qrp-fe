import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from 'react-google-autocomplete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Test from './Test';

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {
  Box,
  CircularProgress,
  FormControl,
  Icon,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField
} from '@material-ui/core';
import Parse from 'parse';
import useNotify from 'hooks/useNotify';
import { useEffect } from 'react';

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

  const [value, setValue] = useState('');

  console.log({ value });

  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const toast = useNotify();

  const handleClose = () => {
    setMessage('');
    setLoading(false);
    setOpen(false);
  };
  const handleSend = async () => {
    const include_player_ids = data.map(item => item.deviceId);
    setLoading(true);
    const res = await Parse.Cloud.run('sendPush', {
      include_player_ids,
      message,
      headings: 'Message from QRP Consulting',
      type: 'adminPush'
    }).catch(err => {
      setLoading(false);
      toast(err.message, 'error');
    });

    if (res) {
      setMessage('');
      setLoading(false);
      setOpen(false);
      toast('Successfully sent.', 'success');
      const Notifications = Parse.Object.extend('Notifications');
      data.forEach(user => {
        const notifications = new Notifications();
        notifications.set('from', Parse.User.current());
        notifications.set('to', { __type: 'Pointer', className: '_User', objectId: user.id });
        notifications.set('type', ['adminPush']);
        notifications.set('read', false);
        notifications.set('notes', message);
        notifications.save();
      });
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      streetAddress: user.addressOne,
      city: user.city,
      province: user.province,
      postalCode: user.postalCode,
      country: user.country
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
        <Test />
        {/* <GooglePlacesAutocomplete
          apiKey="AIzaSyDQlMDmtfECBU455cekml_oYMnKkd3DBKA"
          selectProps={{
            value,
            onChange: setValue
          }}
        /> */}
        {/* <Autocomplete
          apiKey="AIzaSyDQlMDmtfECBU455cekml_oYMnKkd3DBKA"
          onPlaceSelected={place => {
            console.log(place);
          }}
        /> */}

        {/* <TextField
          label="Search Location"
          className={classes.textField}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnOutlinedIcon />
              </InputAdornment>
            )
          }}
        /> */}
        <TextField
          label="Street Address"
          value={formData.streetAddress}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
        />
        <TextField
          label="City"
          value={formData.city}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
        />
        <TextField
          label="Province"
          value={formData.province}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
        />
        <TextField
          label="Postal Code"
          value={formData.postalCode}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
        />
        <TextField
          label="Country"
          value={formData.country}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.textField}
        />
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 16px 24px' }}>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleSend}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
