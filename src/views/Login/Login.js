import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Parse from 'parse';
import { useHistory } from 'react-router';

import InputLabel from '@material-ui/core/InputLabel';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import CustomInput from 'components/CustomInput/CustomInput.js';
import Button from 'components/CustomButtons/Button.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardAvatar from 'components/Card/CardAvatar.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { CircularProgress, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import classNames from 'classnames';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 150,
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
  }
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const currentUser = Parse.User.current();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    Parse.User.logIn(formData.username, formData.password)
      .then(async res => {
        const roles = await new Parse.Query(Parse.Role).equalTo('users', res).find();

        if (roles.some(role => role.get('name') === 'Administrator')) {
          setLoading(false);
          history.push('/admin');
        } else {
          setLoading(false);
          setError('Sorry! you are not authorized');
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>QRP Consulting</h4>
          <p className={classes.cardCategoryWhite}>Admin Login</p>
        </CardHeader>
        <form
          className={classNames(classes.form, { [classes.formDisable]: loading })}
          noValidate
          onSubmit={handleSubmit}
        >
          <CardBody>
            {/* <GridContainer>
            <GridItem xs={12} sm={12} md={3}> */}
            <CustomInput
              labelText="Username"
              id="username"
              formControlProps={{
                fullWidth: true,
                onChange: e => setFormData({ ...formData, username: e.target.value })
              }}
            />
            <CustomInput
              labelText="Password"
              inputProps={{
                type: showPassword ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              id="password"
              formControlProps={{
                fullWidth: true,
                onChange: e => setFormData({ ...formData, password: e.target.value })
              }}
            />

            <Typography variant="caption" display="block" align="center" color="secondary">
              {error}
            </Typography>
          </CardBody>
          <CardFooter style={{ justifyContent: 'center' }}>
            <Button color="primary" type="submit">
              Login
            </Button>
          </CardFooter>

          {loading && <CircularProgress className={classes.progress} />}
        </form>
      </Card>
      {/* <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
  );
}
