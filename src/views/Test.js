import { Box, Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Parse from 'parse';
import TestTextField from './TestTextField';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const Test = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [url, setUrl] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');

  const createPaymentIntent = async () => {
    const pI = await Parse.Cloud.run('createPaymentIntent', {
      data: {
        amount: 1000,
        currency: 'cad',
        payment_method_types: ['card'],
        capture_method: 'manual',
        payment_method: 'pm_1JMe9MDkImmDuu4ZDbuiHiRK',
        customer: 'cus_K0f7S8ygS0IC59',
        confirm: true,
        // on_behalf_of: currentUser?.get('stripeCustomerId'),
        transfer_data: {
          amount: 800,
          destination: currentUser?.get('stripeCustomerId')
        }
      }
    }).catch(err => {
      console.log({ err });
    });

    if (pI) {
      setPaymentIntent(pI.id);
      console.log({ pI });
    }
  };

  const capturePayment = async () => {
    const cP = await Parse.Cloud.run('capturePayment', {
      paymentIntentId: 'pi_3JO3nwDkImmDuu4Z2CgQppZv'
    }).catch(err => {
      console.log({ err });
    });

    console.log({ cP });
  };

  const retriveStripeAccount = async () => {
    console.log({ currentUser });
    const account = await Parse.Cloud.run('retriveStripeAccount', {
      accountId: currentUser.get('stripeAccountId')
    }).catch(err => {
      console.log({ err });
    });

    console.log({ account });
  };

  const getConnectedAccounts = async () => {
    const cA = await Parse.Cloud.run('getConnectedAccounts').catch(err => {
      console.log({ err });
    });

    console.log({ cA });
  };

  const createStripeAccount = async () => {
    const acc = await Parse.Cloud.run('createStripeAccount', {
      email: currentUser.get('customEmail'),
      country: currentUser.get('country')
    }).catch(err => {
      console.log({ err });
    });
    console.log({ acc });
  };

  const deleteStripeAccount = async id => {
    const acc = await Parse.Cloud.run('deleteStripeAccount', {
      id
      // id: currentUser.get('stripeCustomerId')
    }).catch(err => {
      console.log({ err });
    });

    console.log({ acc });
  };

  const deleteAllAccounts = async () => {
    const acc = await Parse.Cloud.run('deleteConnectedAccounts').catch(err => {
      console.log({ err });
    });

    console.log({ acc });
  };

  const createAccountLink = async () => {
    const accLink = await Parse.Cloud.run('createAccountLink', {
      accountId: currentUser.get('stripeCustomerId'),
      refreshURL: 'http://localhost:3000/#/test',
      returnURL: 'http://localhost:3000/#/test'
    }).catch(err => {
      console.log({ err });
    });

    if (accLink) {
      setUrl(accLink.url);
      console.log({ accLink });
    }
  };

  const getBalance = async () => {
    const balance = await Parse.Cloud.run('getBalance', {
      stripeAccountId: 'acct_1JRec1PrhCdnCK3u'
      // stripeAccountId: currentUser.get('stripeCustomerId')
    }).catch(err => {
      console.log({ err });
    });

    console.log({ balance });
  };

  const createPayout = async () => {
    const payout = await Parse.Cloud.run('createPayout', {
      amount: 5000,
      currency: 'cad',
      // stripeAccountId: currentUser.get('stripeCustomerId')
      stripeAccountId: 'acct_1JRec1PrhCdnCK3u'
    }).catch(err => {
      console.log({ err });
    });

    console.log({ payout });
  };

  const retrivePayout = async () => {
    const payout = await Parse.Cloud.run('retrivePayout', {
      payoutId: 'po_1JRgxQPrhCdnCK3u1OG0sjKv'
    }).catch(err => {
      console.log({ err });
    });

    console.log({ payout });
  };

  const retrivePaymentIntent = async id => {
    const PaymentIntent = await Parse.Cloud.run('retrivePaymentIntent', {
      paymentIntentId: id
    }).catch(err => {
      console.log({ err });
    });

    console.log({ PaymentIntent });
  };

  const getWorkingSummary = async id => {
    const workingSummary = await Parse.Cloud.run('getWorkingSummary').catch(err => {
      console.log({ err });
    });

    console.log({ workingSummary });
  };

  const penalty = async () => {
    // const penalty = await Parse.Cloud.run('penaltyForShiftCancelling').catch(err => {
    //   console.log({ err });
    // });
    const penalty = await Parse.Cloud.run('createShiftPaymentIntent', {
      shiftCandidateId: 'Vnui5jzhUM'
    }).catch(err => {
      console.log({ err });
    });

    console.log({ penalty });
  };

  useEffect(async () => {
    const user = await Parse.Cloud.run('currentUser').catch(err => {
      console.log({ err });
    });
    console.log({ user });

    setCurrentUser(user);
  }, []);

  return (
    <div>
      <h1>Test</h1>
      <p>id : {currentUser?.get('stripeCustomerId')}</p>

      {url && (
        <p>
          orboard url :<a href={url}>{url}</a>
        </p>
      )}
      {paymentIntent && <p>Payment Intent Id : {paymentIntent}</p>}

      <Box display="flex" flexDirection="column">
        <Button onClick={createStripeAccount} variant="outlined" style={{ marginBottom: 4 }}>
          Create Stripe Account
        </Button>
        <Button onClick={retriveStripeAccount} variant="outlined" style={{ marginBottom: 4 }}>
          Retrive Stripe Account
        </Button>
        <Box>
          <TestTextField
            placeholder="Account Id"
            title="Delete account"
            handleSubmit={deleteStripeAccount}
          />
        </Box>
        <Button onClick={createAccountLink} variant="outlined" style={{ marginBottom: 4 }}>
          Create Account Link
        </Button>
        <Button onClick={createPaymentIntent} variant="outlined" style={{ marginBottom: 4 }}>
          Create Payment Intent
        </Button>
        <Box>
          <TestTextField
            placeholder="Payment Intent ID"
            title="Retrive Payment Intent"
            handleSubmit={retrivePaymentIntent}
          />
        </Box>
        <Button onClick={capturePayment} variant="outlined" style={{ marginBottom: 4 }}>
          Capture Payment
        </Button>
        <Button onClick={getBalance} variant="outlined" style={{ marginBottom: 4 }}>
          Get Balance
        </Button>
        <Button onClick={createPayout} variant="outlined" style={{ marginBottom: 4 }}>
          Create Payout
        </Button>
        <Button onClick={retrivePayout} variant="outlined" style={{ marginBottom: 4 }}>
          Retrive Payout
        </Button>
        <Button onClick={deleteAllAccounts} variant="outlined" style={{ marginBottom: 4 }}>
          Delete All Account
        </Button>
        <Button onClick={penalty} variant="outlined" style={{ marginBottom: 4 }}>
          Penalty
        </Button>
        <Button onClick={getWorkingSummary} variant="outlined" style={{ marginBottom: 4 }}>
          Get Working Summary
        </Button>
      </Box>
    </div>
  );
};

export default Test;
