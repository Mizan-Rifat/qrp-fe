import React, { useState } from 'react';
import { Box, Grid, makeStyles } from '@material-ui/core';
import DetailsLayout from 'layouts/DetailsLayout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchShift } from 'redux/ducks/shiftDuck';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { resetShiftState } from 'redux/ducks/shiftDuck';
import ShiftActionButtons from './ShiftActionsButtons';
import { LoadingLayout } from 'layouts/LoadingLayout';

const styles = {
  gridItem: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0'
  }
};

const useStyles = makeStyles(styles);

const getManagerInfo = shift => {
  let name = '';
  let phone = '';
  const rating = shift.pharmacyId.avgRatings?.toFixed(2) || 0;
  if (shift.pharmacyId.managerAsOwner) {
    name = `${shift.pharmacyId.firstName} ${shift.pharmacyId.lastName}`;
    phone = shift.pharmacyId.phone;
  } else {
    name = `${shift.manager.firstName} ${shift.manager.lastName}`;
    phone = shift.manager.phone;
  }
  return `Name : ${name} <br> Phone : ${phone} <br> Rating : ${rating}`;
};

const ShiftDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const { fetching, loading, shift } = useSelector(state => state.shift);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShift(id));
    return () => {
      dispatch(resetShiftState());
    };
  }, [id]);

  useEffect(() => {
    if (Object.keys(shift).length) {
      const data = [
        shift.shifter && {
          label: 'Current worker',
          render: (
            <Link to={`/user/${shift.shifter.candidate?.id}`}>
              {`${shift.shifter.candidate?.get('firstName')} ${shift.shifter.candidate?.get(
                'lastName'
              )}`}
            </Link>
          )
        },
        {
          label: 'Status',
          value: shift.status ? shift.shifter?.shiftStatus : 'Pending'
        },
        shift.notes && {
          label: 'Notes',
          value: shift.notes
        },
        {
          label: 'Position Required',
          value: shift.requestFor
        },
        {
          label: 'Required Skills',
          value: shift.skills.join(', ')
        },
        {
          label: 'Date',
          value: dayjs(shift.shiftDate).format('DD MMM, YYYY')
        },
        {
          label: 'Time',
          value: `${dayjs(shift.formattedStartTime).format('hh:mm a')} - ${dayjs(
            shift.formattedEndTime
          ).format('hh:mm a')}`
        },
        {
          label: 'Hourly Rate',
          value: shift.payRate.toLocaleString('en-CA', {
            style: 'currency',
            currency: 'CAD'
          })
        },
        {
          label: 'Total Cost',
          value: shift.totalShiftCost.toLocaleString('en-CA', {
            style: 'currency',
            currency: 'CAD'
          })
        },
        {
          label: 'Negotiable',
          value: shift.negotiable ? 'Yes' : 'No'
        },
        {
          label: 'Language Used',
          value: shift.languageUsed ? `${shift.languageUsed}, English` : 'English'
        },
        {
          label: 'Pharmacy Name',
          value: shift.pharmacyId?.pharmacyName
        },
        {
          label: 'Pharmacy type',
          value: shift.pharmacyId?.pharmacyType
        },
        {
          label: 'Location',
          value: [
            shift.pharmacyId?.addressOne,
            shift.pharmacyId?.city,
            shift.pharmacyId?.province,
            shift.pharmacyId?.postalCode,
            shift.pharmacyId?.country
          ]
            .filter(item => item)
            .join(',')
        },
        {
          label: 'Dispensing',
          value: shift.dispensingSystem
        },
        {
          label: 'Script count',
          value: shift.rxCount
        },
        {
          label: 'Tech Present',
          value: shift.techPresent ? 'Yes' : 'No'
        },
        {
          label: 'Assistant Present',
          value: shift.assistantPresent ? 'Yes' : 'No'
        },
        {
          label: 'Travel Expense',
          value: shift.travellingExpense ? '48cents/km' : 'No'
        },
        {
          label: 'Accomodation',
          value: shift.accomodationExpense ? `$${shift.accomodationExpenseValue}` : 'No'
        },
        {
          label: 'Manager Info',
          value: shift.pharmacyId ? getManagerInfo(shift) : ''
        }
      ];

      setData(data.filter(item => item));
    }
  }, [shift]);

  return (
    <DetailsLayout title="Shift Deatils">
      <LoadingLayout loading={fetching || loading} position={{ left: '45%', top: '20%' }}>
        <ShiftActionButtons shift={shift} />
        <Grid container spacing={3}>
          {data.map((item, index) => (
            <Grid
              item
              xs={12}
              md={data.length % 2 !== 0 && index === data.length - 1 ? 12 : 6}
              className={classes.gridItem}
            >
              <Grid container>
                <Grid item xs={6} md={data.length % 2 !== 0 && index === data.length - 1 ? 3 : 6}>
                  <p style={{ fontWeight: 400, margin: 0 }}>{item.label}</p>
                </Grid>
                <Grid item xs={6} md={data.length % 2 !== 0 && index === data.length - 1 ? 3 : 6}>
                  {item.render ? (
                    item.render
                  ) : (
                    <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: item.value }} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </LoadingLayout>
    </DetailsLayout>
  );
};

export default ShiftDetails;
