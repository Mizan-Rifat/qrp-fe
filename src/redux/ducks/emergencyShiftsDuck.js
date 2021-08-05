import Parse from 'parse';
//actions

const EMERGENCYSHIFTS_FETCHED = 'qrp/emergencyShifts/emergencyShifts_fetched';
const EMERGENCYSHIFTS_ADDED = 'qrp/emergencyShifts/emergencyShifts_added';
const EMERGENCYSHIFTS_DELETED = 'qrp/emergencyShifts/emergencyShifts_deleted';
const EMERGENCYSHIFTS_UPDATED = 'qrp/emergencyShifts/emergencyShifts_updated';

const LOADING_TRUE = 'qrp/emergencyShifts/loading_true';
const LOADING_FALSE = 'qrp/emergencyShifts/loading_false';
const FETCHING_TRUE = 'qrp/emergencyShifts/fetching_true';
const FETCHING_FALSE = 'qrp/emergencyShifts/fetching_false';
const SET_ERRORS = 'qrp/emergencyShifts/set_errors';

// reducers

const initState = {
  fetching: true,
  loading: false,
  emergencyShifts: [],
  error: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case EMERGENCYSHIFTS_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        emergencyShifts: action.payload
      };

    case EMERGENCYSHIFTS_ADDED:
      return {
        ...state,
        loading: false,
        emergencyShifts: [...state.emergencyShifts, action.payload]
      };
    case EMERGENCYSHIFTS_UPDATED:
      return {
        ...state,
        loading: false,
        emergencyShifts: state.emergencyShifts.map(item =>
          item.id == action.payload.id ? action.payload : item
        )
      };
    case EMERGENCYSHIFTS_DELETED:
      return {
        ...state,
        loading: false,
        emergencyShifts: state.emergencyShifts.filter(item => item.id != action.payload)
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

export const emergencyShiftsFetched = data => {
  return {
    type: EMERGENCYSHIFTS_FETCHED,
    payload: data
  };
};

export const emergencyShiftsUpdated = data => {
  return {
    type: EMERGENCYSHIFTS_UPDATED,
    payload: data
  };
};
export const emergencyShiftsDeleted = id => {
  return {
    type: EMERGENCYSHIFTS_DELETED,
    payload: id
  };
};
export const emergencyShiftsAdded = data => {
  return {
    type: EMERGENCYSHIFTS_ADDED,
    payload: data
  };
};

export const setErrors = error => {
  return {
    type: SET_ERRORS,
    payload: error
  };
};

export const fetchEmergencyshifts = () => async dispatch => {
  dispatch({ type: FETCHING_TRUE });

  const Emergencyshifts = Parse.Object.extend('emergencyShifts');
  const emergencyShifts = new Parse.Query(Emergencyshifts);
  emergencyShifts.include('from');

  const shifts = await emergencyShifts.find().catch(err => {
    dispatch({ type: FETCHING_FALSE });
    return Promise.reject(err);
  });

  dispatch(emergencyShiftsFetched(shifts));
};

export const updateEmergencyshifts = (id, status) => async (dispatch, getState) => {
  dispatch({ type: LOADING_TRUE });
  const shift = getState().emergencyShifts.emergencyShifts.find(shift => shift.id === id);
  shift.set('resolved', status);
  const res = await shift.save().catch(err => {
    dispatch({ type: LOADING_FALSE });
    return Promise.reject(err);
  });

  dispatch({ type: LOADING_FALSE });

  return Promise.resolve(res);
};
