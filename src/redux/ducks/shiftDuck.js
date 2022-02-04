import dayjs from 'dayjs';
import Parse from 'parse';
//actions

const SHIFT_FETCHED = 'qrp/shift/shift_fetched';
const SHIFT_UPDATED = 'qrp/shift/shift_updated';

const LOADING_TRUE = 'qrp/shift/loading_true';
const LOADING_FALSE = 'qrp/shift/loading_false';
const FETCHING_TRUE = 'qrp/shift/fetching_true';
const FETCHING_FALSE = 'qrp/shift/fetching_false';
const SET_ERRORS = 'qrp/shift/set_errors';
const RESET = 'qrp/shift/reset';

// reducers

const initState = {
  fetching: true,
  loading: false,
  shift: [],
  parseShift: [],
  error: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case SHIFT_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        shift: action.payload.shift,
        parseShift: action.payload.parseShift
      };

    case SHIFT_UPDATED:
      return {
        ...state,
        loading: false,
        shift: {
          ...state.shift,
          ...action.payload.updatedShift
        },
        parseShift: action.payload.parseShift
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
    case RESET:
      return initState;

    default:
      return state;
  }
};

// action_creators

export const shiftFetched = (shift, parseShift) => {
  return {
    type: SHIFT_FETCHED,
    payload: { shift, parseShift }
  };
};

export const resetShiftState = () => {
  return {
    type: RESET
  };
};

export const shiftUpdated = (updatedShift, parseShift) => {
  return {
    type: SHIFT_UPDATED,
    payload: {
      updatedShift,
      parseShift
    }
  };
};

export const fetchShift = id => async dispatch => {
  dispatch({ type: FETCHING_TRUE });

  const Shifts = Parse.Object.extend('Shifts');
  const shiftQuery = new Parse.Query(Shifts);
  shiftQuery.include('pharmacyId', 'shifter.candidate');

  const parseShift = await shiftQuery.get(id).catch(err => {
    dispatch({ type: FETCHING_FALSE });
    return Promise.reject(err);
  });

  const startTime = parseShift.get('startTime').split(':');
  const endTime = parseShift.get('endTime').split(':');
  const formattedStartTime = dayjs(parseShift.get('shiftDate'))
    .set('hour', startTime[0])
    .set('minute', startTime[1]);
  const formattedEndTime = dayjs(parseShift.get('shiftDate'))
    .set('hour', endTime[0])
    .set('minute', endTime[1]);

  let manager = null;
  if (parseShift.get('pharmacyId') && !parseShift.get('pharmacyId').get('managerAsOwner')) {
    const Manager = Parse.Object.extend('pharmacyManagers');
    const managerQuery = new Parse.Query(Manager);
    managerQuery.equalTo('userId', {
      __type: 'Pointer',
      className: '_User',
      objectId: parseShift.get('pharmacyId').id
    });

    const parseManager = await managerQuery.first();

    manager = {
      id: parseManager.id,
      ...parseManager.attributes
    };
  }

  const shift = {
    id: parseShift.id,
    ...parseShift.attributes,
    formattedStartTime,
    formattedEndTime,
    manager,
    pharmacyId: parseShift.get('pharmacyId') && {
      id: parseShift.get('pharmacyId')?.id,
      ...parseShift.get('pharmacyId')?.attributes
    },
    shifter: parseShift.get('shifter') && {
      id: parseShift.get('shifter')?.id,
      ...parseShift.get('shifter')?.attributes
    }
  };

  dispatch(shiftFetched(shift, parseShift));
};

export const cancelShift = shiftId => async dispatch => {
  dispatch({ type: LOADING_TRUE });

  const updatedShift = await Parse.Cloud.run('cancelShift', {
    shiftId
  }).catch(err => {
    console.log({ err });
    dispatch({ type: LOADING_FALSE });
    return Promise.reject(err);
  });

  console.log({ updatedShift });
  if (updatedShift) {
    dispatch(
      shiftUpdated(
        {
          status: false,
          shifter: null
        },
        updatedShift
      )
    );
    return Promise.resolve();
  }
};

export const deleteShift = shiftId => async dispatch => {
  dispatch({ type: LOADING_TRUE });
  await Parse.Cloud.run('deleteShift', {
    shiftId
  }).catch(err => {
    console.log({ err });
    dispatch({ type: LOADING_FALSE });
    return Promise.reject(err);
  });

  dispatch({ type: LOADING_FALSE });
  return Promise.resolve();
};
