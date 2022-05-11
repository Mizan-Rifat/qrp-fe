import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Parse from 'parse';
import { useHistory } from 'react-router';
import CustomInput from 'components/CustomInput/CustomInput.js';
import Button from 'components/CustomButtons/Button.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { CircularProgress, Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import useNotify from 'hooks/useNotify';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    position: 'relative'
  },
  formDisable: {
    pointerEvents: 'none',
    opacity: 0.5
  },
  progress: {
    position: 'absolute',
    top: '35%',
    left: '43%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  },
  textField: {
    marginBottom: 12
  }
}));

export const PasswordTextField = ({ label, errors, register, name, validation }) => {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  return (
    <>
      <TextField
        className={classes.textField}
        fullWidth
        label={label}
        InputProps={{
          type: show ? 'text' : 'password',
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)}>
                {!show ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={!!errors[name]}
        helperText={errors[name]?.message}
        {...register(name, validation)}
        // {...rest}
      />
    </>
  );
};

export default function UpdatePassword() {
  const classes = useStyles();
  const history = useHistory();
  const toast = useNotify();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  console.log({ errors });

  const onSubmit = async data => {
    console.log({ data });
    setLoading(true);
    const username = Parse.User.current().get('username');

    const user = await Parse.User.logIn(username, data.currentPassword).catch(error => {
      setError('currentPassword', { type: 'custom', message: 'Current Password is incorrect' });
      toast('Current Password is incorrect', 'error');
      setLoading(false);
      console.log({ error });
    });

    if (user) {
      const res = await Parse.Cloud.run('deleteUser', {
        password: data.newPassword
      }).catch(error => {
        toast(error.message, 'error');
        console.log({ error });
      });
      if (res) {
        toast(res.message, 'success');
        await Parse.User.logOut();
        history.push('/admin/login');
      }
    }
    setLoading(false);
  };

  return (
    <Container className={classes.root}>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>QRP Consulting</h4>
          <p className={classes.cardCategoryWhite}>Change Password</p>
        </CardHeader>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <CardBody style={{ marginTop: 10 }}>
              <h5 style={{ marginTop: 0 }}>Change Password</h5>
              <p>
                Password must contain at least 8 characters and at least 3 out of 4 following
                criteria:{' '}
              </p>
              <ul style={{ paddingLeft: 16 }}>
                <li>At least 1 upper case letter (A-Z)</li>
                <li>At least 1 lower case letter (a-z)</li>
                <li>At least 1 number (0-9)</li>
                <li>At least 1 special characters ( @$!%*?& )</li>
              </ul>
            </CardBody>
          </Grid>
          <Grid item xs={12} md={7}>
            <form
              className={classNames(classes.form, { [classes.formDisable]: loading })}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <CardBody style={{ paddingBottom: 0, marginTop: 35 }}>
                <PasswordTextField
                  label="Current Password"
                  name="currentPassword"
                  errors={errors}
                  register={register}
                  validation={{
                    required: 'This field is required'
                  }}
                />
                <PasswordTextField
                  label="New Password"
                  name="newPassword"
                  errors={errors}
                  register={register}
                  validation={{
                    required: 'This field is required',
                    minLength: {
                      value: 8,
                      message: 'At least 8 characters'
                    },
                    // validate: {
                    //   lowerCase: value =>
                    //     /^(?=.*[a-z])+/.test(value) || 'At least 1 lower case letter (a-z)',
                    //   upperCase: value =>
                    //     /^(?=.*[A-Z])+/.test(value) || 'At least 1 upper case letter (A-Z)',
                    //   number: value => /^(?=.*\d)+/.test(value) || 'At least 1 number (0-9)',
                    //   symbol: value =>
                    //     /^(?=.*[@$!%*?&])+/.test(value) ||
                    //     'At least 1 special characters ( @$!%*?& )'
                    // }
                    validate: value => {
                      let index = 0;
                      if (/^(?=.*[a-z])+/.test(value)) {
                        index = index + 1;
                      }
                      if (/^(?=.*[A-Z])+/.test(value)) {
                        index = index + 1;
                      }
                      if (/^(?=.*\d)+/.test(value)) {
                        index = index + 1;
                      }
                      if (/^(?=.*[@$!%*?&])+/.test(value)) {
                        index = index + 1;
                      }
                      if (index < 3) {
                        return `Your password doesn't match required criteria `;
                      }
                      return true;
                    }
                  }}
                />
                <PasswordTextField
                  label="Confirm Password"
                  name="confirmPassword"
                  errors={errors}
                  register={register}
                  validation={{
                    validate: val => watch('newPassword') === val || 'Your passwords do no match'
                  }}
                />
              </CardBody>
              <CardFooter style={{ justifyContent: 'center' }}>
                <Button color="primary" type="submit">
                  Change password
                </Button>
              </CardFooter>

              {loading && <CircularProgress className={classes.progress} />}
            </form>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
