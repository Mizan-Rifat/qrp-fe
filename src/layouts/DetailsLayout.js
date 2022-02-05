import React from 'react';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { Box, Button as MButton, makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Loading } from 'components/Loading/Loading';
import { useHistory } from 'react-router';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
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
  cardBody: {
    minHeight: '250px'
  }
};

const useStyles = makeStyles(styles);

const DetailsLayout = ({ title, subtitle, loading, children }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Box position="relative">
      {loading ? (
        <Loading position={{ top: '40%', left: '50%' }} />
      ) : (
        <>
          <Box mb={6}>
            <MButton
              variant="contained"
              color="secondary"
              className={classes.button}
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => history.goBack()}
            >
              Back to list
            </MButton>
          </Box>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>{title}</h4>
              <p className={classes.cardCategoryWhite}>{subtitle}</p>
            </CardHeader>
            <CardBody className={classes.cardBody}>{children}</CardBody>
          </Card>
        </>
      )}
    </Box>
  );
};

export default DetailsLayout;
