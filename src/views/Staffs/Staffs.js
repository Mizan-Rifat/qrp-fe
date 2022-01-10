import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import useNotify from 'hooks/useNotify';
import { fetchEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import Parse from 'parse';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import distance from 'google-distance-matrix';
distance.key('AIzaSyA1f7fx1qEvKj77QHf7hnDaanMoYyXrXwc');
distance.mode('driving');

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];
  const toast = useNotify();

  const { staffs, fetching, loading } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(async () => {
    // const customer = await Parse.Cloud.run('retriveStripeCustomer', {
    //   customerId: 'cus_KpK88KVYuyQhTy'
    // });
    // console.log({ customer });

    const Shifts = Parse.Object.extend('Shifts');
    const shiftQuery = new Parse.Query(Shifts);
    // shiftQuery.get('DUqED1a2TD');
    shiftQuery.equalTo('objectId', 'yItUBvqns5');
    // const shift = await shiftQuery.get('DUqED1a2TD');
    shiftQuery.include('pharmacyId');
    shiftQuery.include('shifter.candidate');
    const shift = await shiftQuery.first();

    const shiftTime = shift.get('startTime').split(':');
    const shiftDate = dayjs(shift.get('shiftDate'))
      .set('hour', shiftTime[0])
      .set('minute', shiftTime[1]);

    console.log(shiftDate.format('HH:MM a'));

    console.log({ shift });
  }, []);
  return (
    <Users type={type} title="Manage Staffs" users={staffs} fetching={fetching} loading={loading} />
  );
};

const obj = {
  id: 'evt_3KEbimLMHciGDbmW1XUzO7HG',
  object: 'event',
  api_version: '2020-08-27',
  created: 1641397697,
  data: {
    object: {
      id: 'pi_3KEbimLMHciGDbmW1d31br9H',
      object: 'payment_intent',
      amount: 2000,
      amount_capturable: 0,
      amount_received: 2000,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic',
      charges: {
        object: 'list',
        data: [
          {
            id: 'ch_3KEbimLMHciGDbmW1wRUSoeu',
            object: 'charge',
            amount: 2000,
            amount_captured: 2000,
            amount_refunded: 0,
            application: null,
            application_fee: null,
            application_fee_amount: null,
            balance_transaction: 'txn_3KEbimLMHciGDbmW11qrKrEk',
            billing_details: {
              address: {
                city: null,
                country: null,
                line1: null,
                line2: null,
                postal_code: null,
                state: null
              },
              email: null,
              name: null,
              phone: null
            },
            calculated_statement_descriptor: 'QRPCONSULTING.COM',
            captured: true,
            created: 1641397697,
            currency: 'usd',
            customer: null,
            description: '(created by Stripe CLI)',
            destination: null,
            dispute: null,
            disputed: false,
            failure_code: null,
            failure_message: null,
            fraud_details: {},
            invoice: null,
            livemode: false,
            metadata: {},
            on_behalf_of: null,
            order: null,
            outcome: {
              network_status: 'approved_by_network',
              reason: null,
              risk_level: 'normal',
              risk_score: 15,
              seller_message: 'Payment complete.',
              type: 'authorized'
            },
            paid: true,
            payment_intent: 'pi_3KEbimLMHciGDbmW1d31br9H',
            payment_method: 'pm_1KEbimLMHciGDbmWLYvE3jXh',
            payment_method_details: {
              card: {
                brand: 'visa',
                checks: {
                  address_line1_check: null,
                  address_postal_code_check: null,
                  cvc_check: null
                },
                country: 'US',
                exp_month: 1,
                exp_year: 2023,
                fingerprint: '8lOKYHOK3h269IlE',
                funding: 'credit',
                installments: null,
                last4: '4242',
                network: 'visa',
                three_d_secure: null,
                wallet: null
              },
              type: 'card'
            },
            receipt_email: null,
            receipt_number: null,
            receipt_url:
              'https://pay.stripe.com/receipts/acct_1IsfUfLMHciGDbmW/ch_3KEbimLMHciGDbmW1wRUSoeu/rcpt_KuQZdSoGs2zTxjU8mnUT0u0aTZfhtDK',
            refunded: false,
            refunds: {
              object: 'list',
              data: [],
              has_more: false,
              total_count: 0,
              url: '/v1/charges/ch_3KEbimLMHciGDbmW1wRUSoeu/refunds'
            },
            review: null,
            shipping: {
              address: {
                city: 'San Francisco',
                country: 'US',
                line1: '510 Townsend St',
                line2: null,
                postal_code: '94103',
                state: 'CA'
              },
              carrier: null,
              name: 'Jenny Rosen',
              phone: null,
              tracking_number: null
            },
            source: null,
            source_transfer: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: 'succeeded',
            transfer_data: null,
            transfer_group: null
          }
        ],
        has_more: false,
        total_count: 1,
        url: '/v1/charges?payment_intent=pi_3KEbimLMHciGDbmW1d31br9H'
      },
      client_secret: 'pi_3KEbimLMHciGDbmW1d31br9H_secret_F1WHZbL0OYm3i6EuGbBFz0Sgu',
      confirmation_method: 'automatic',
      created: 1641397696,
      currency: 'usd',
      customer: null,
      description: '(created by Stripe CLI)',
      invoice: null,
      last_payment_error: null,
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: 'pm_1KEbimLMHciGDbmWLYvE3jXh',
      payment_method_options: {
        card: {
          installments: null,
          network: null,
          request_three_d_secure: 'automatic'
        }
      },
      payment_method_types: ['card'],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: {
        address: {
          city: 'San Francisco',
          country: 'US',
          line1: '510 Townsend St',
          line2: null,
          postal_code: '94103',
          state: 'CA'
        },
        carrier: null,
        name: 'Jenny Rosen',
        phone: null,
        tracking_number: null
      },
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'succeeded',
      transfer_data: null,
      transfer_group: null
    }
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: 'req_ROXHmC71FHdsgY',
    idempotency_key: '92b9cf4b-75ad-4f5f-ac12-07af3d628c6d'
  },
  type: 'payment_intent.succeeded'
};

export default Staffs;
