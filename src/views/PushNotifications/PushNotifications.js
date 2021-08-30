import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import MaterialTable from 'material-table';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Icon,
  MenuItem,
  TextField
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import { updateEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import useNotify from 'hooks/useNotify';
import { Link } from 'react-router-dom';
import Parse from 'parse';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: 16
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1'
    }
  },
  formDisable: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}));

export default function PushNotifications() {
  const classes = useStyles();
  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState('all');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    console.log({ province, message });
  };

  useEffect(async () => {
    const User = new Parse.User();
    const userQuery = new Parse.Query(User);
    userQuery.exists('deviceId');
    const parseUser = await userQuery.find().catch(err => {
      console.log({ err });
    });

    const provinces = parseUser.map(user => user.get('province'));
    setProvinces([...new Set(provinces)]);
  }, []);
  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Custom Push Notifications to Owner</h4>
      </CardHeader>
      <CardBody>
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            {loading && (
              <Box position="absolute" top="40%" left="47%">
                <CircularProgress />
              </Box>
            )}
            <form
              onSubmit={handleSubmit}
              className={classNames(classes.form, { [classes.formDisable]: loading })}
            >
              <TextField
                id="outlined-select-currency"
                select
                label="User Type"
                value={province}
                onChange={e => setProvince(e.target.value)}
                helperText="Please select user type"
                variant="outlined"
                fullWidth
                style={{ marginBottom: 32 }}
              >
                <MenuItem value="all">All User</MenuItem>
                {provinces.map(province => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="outlined-multiline-flexible"
                label="Message"
                multiline
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                variant="outlined"
                fullWidth
              />

              <Box textAlign="right" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<Icon>send</Icon>}
                >
                  Send
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </CardBody>
    </Card>
  );
}
