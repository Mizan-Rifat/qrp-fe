import React, { useState } from 'react';
import { Box, Grid, makeStyles } from '@material-ui/core';
import DetailsLayout from 'layouts/DetailsLayout';
import MaterialTable from 'material-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchShift } from 'redux/ducks/shiftDuck';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { resetShiftState } from 'redux/ducks/shiftDuck';
import { Loading } from 'components/Loading/Loading';

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

// const getShiftStatus = shift => {
//   if (
//     new Date().getTime() <= new Date(shift.shiftDate).getTime() &&
//     shift.status &&
//     shift.shifter
//   ) {
//     if (['pharmacyOwner'].includes(this.userType)) {
//       return { status: 'Pending', color: 'orange' };
//     } else if (
//       !this.shift.get('status') &&
//       this.shift.get('createdByAdmin') &&
//       this.shift.jobStatus !== 'Cancelled'
//     ) {
//       return { status: 'Emergency', color: 'red' };
//     } else {
//       return {
//         status: this.shift.jobStatus && this.shift.jobStatus,
//         color:
//           this.shift.jobStatus && this.shift.jobStatus === 'Cancelled'
//             ? 'red'
//             : this.shift.jobStatus === 'Requested'
//             ? 'orange'
//             : 'green darken-4'
//       };
//     }
//   } else if (
//     this.shift.get('shifter') &&
//     (this.shift.get('shifter').get('jobStatus') || this.shift.jobStatus) &&
//     this.shift.get('status')
//   ) {
//     return {
//       status: this.shift.get('shifter').get('jobStatus') || this.shift.jobStatus,
//       color: this.shift.get('shifter').get('jobStatus') === 'Completed' ? 'grey darken-1' : 'green'
//     };
//   } else if (
//     new Date(this.$moment(this.shift.get('shiftDate'))).getTime() <= new Date().getTime()
//   ) {
//     return { status: 'Expired', color: 'secondary' };
//   } else {
//     return { status: 'No status', color: '' };
//   }
// };

const ShiftDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const { fetching, shift } = useSelector(state => state.shift);
  const dispatch = useDispatch();

  console.log({ shift });
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
      {fetching ? (
        <Box height="100%" style={{ pointerEvents: 'none', opacity: 0.5 }}>
          <Loading position={{ top: '50%', left: '50%' }} />
        </Box>
      ) : (
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
      )}
    </DetailsLayout>
  );
};

export default ShiftDetails;
