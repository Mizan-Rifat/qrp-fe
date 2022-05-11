import dayjs from 'dayjs';
import Parse from 'parse';
//actions

const SHIFTS_FETCHED = 'qrp/shifts/shifts_fetched';

const LOADING_TRUE = 'qrp/shifts/loading_true';
const LOADING_FALSE = 'qrp/shifts/loading_false';
const FETCHING_TRUE = 'qrp/shifts/fetching_true';
const FETCHING_FALSE = 'qrp/shifts/fetching_false';
const SET_ERRORS = 'qrp/shifts/set_errors';

// reducers

const initState = {
  fetching: true,
  loading: false,
  shifts: [],
  filtered: false,
  error: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case SHIFTS_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        filtered: action.payload.filtered,
        shifts: action.payload.data
      };

    case LOADING_TRUE:
      return {
        ...state,
        loading: true
      };
    case LOADING_FALSE:
      return {
        ...state,
        loading: false
      };
    case FETCHING_TRUE:
      return {
        ...state,
        fetching: true
      };
    case FETCHING_FALSE:
      return {
        ...state,
        fetching: false
      };
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        fetching: false,
        error: action.payload
      };

    default:
      return state;
  }
};

// action_creators

export const shiftsFetched = (data, filtered) => {
  return {
    type: SHIFTS_FETCHED,
    payload: { data, filtered }
  };
};

export const fetchShifts = (startDate, endDate) => async dispatch => {
  dispatch({ type: FETCHING_TRUE });

  const Shifts = Parse.Object.extend('Shifts');
  const shiftsQuery = new Parse.Query(Shifts);
  let filtered = false;

  if (startDate && endDate) {
    shiftsQuery.greaterThanOrEqualTo('shiftDate', new Date(startDate));
    shiftsQuery.lessThanOrEqualTo('shiftDate', new Date(endDate));
    filtered = true;
  } else {
    shiftsQuery.greaterThanOrEqualTo('shiftDate', new Date());
  }
  shiftsQuery.include('pharmacyId', 'shifter');
  shiftsQuery.limit(1000);

  const parseShifts = await shiftsQuery.find().catch(err => {
    dispatch({ type: FETCHING_FALSE });
    return Promise.reject(err);
  });

  const shifts = parseShifts.map(shift => {
    const startTime = shift.get('startTime').split(':');
    const endTime = shift.get('endTime').split(':');
    const formattedStartTime = dayjs(shift.get('shiftDate'))
      .set('hour', startTime[0])
      .set('minute', startTime[1]);
    const formattedEndTime = dayjs(shift.get('shiftDate'))
      .set('hour', endTime[0])
      .set('minute', endTime[1]);
    return {
      id: shift.id,
      ...shift.attributes,
      formattedStartTime,
      formattedEndTime,
      pharmacyId: shift.get('pharmacyId') && {
        id: shift.get('pharmacyId')?.id,
        ...shift.get('pharmacyId')?.attributes
      },
      shifter: shift.get('shifter') && {
        id: shift.get('shifter')?.id,
        ...shift.get('shifter')?.attributes
      }
    };
  });

  dispatch(shiftsFetched(shifts, filtered));
};
