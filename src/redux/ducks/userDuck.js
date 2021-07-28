import Parse from 'parse';
import { getParseObject } from 'utils';

//Actions

const USER_FETCHED = 'pes/user/users_fetched';
const USER_LOADING_TRUE = 'pes/user/user_loading_true';
const USER_LOADING_FALSE = 'pes/user/user_loading_false';
const USER_FETCHING_TRUE = 'pes/user/user_fetching_true';
const USER_FETCHING_FALSE = 'pes/user/user_fetching_false';
const USER_UPDATED = 'pes/user/user_updated';
const USER_COMISSION_UPDATED = 'pes/user/user_comission_updated';
const RESET = 'pes/user/reset';

const initState = {
  fetching: true,
  loading: true,
  user: {},
  parseUser: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case USER_FETCHED:
      return {
        ...state,
        user: action.payload.user,
        parseUser: action.payload.parseUser,
        loading: false,
        fetching: false
      };

    case USER_UPDATED:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          [action.payload.key]: action.payload.value
        }
      };

    case USER_LOADING_TRUE:
      return {
        ...state,
        loading: true
      };

    case USER_LOADING_FALSE:
      return {
        ...state,
        loading: false
      };
    case USER_FETCHING_TRUE:
      return {
        ...state,
        fetching: true
      };

    case USER_FETCHING_FALSE:
      return {
        ...state,
        fetching: false
      };
    case RESET:
      return initState;

    default:
      return state;
  }
};

export const userFetched = (user, parseUser) => {
  return {
    type: USER_FETCHED,
    payload: { user, parseUser }
  };
};

export const setUserLoadingTrue = () => {
  return {
    type: USER_LOADING_TRUE
  };
};
export const setUserLoadingFalse = () => {
  return {
    type: USER_LOADING_FALSE
  };
};

export const userUpdated = data => {
  return {
    type: USER_UPDATED,
    payload: data
  };
};
export const resetUserState = () => {
  return {
    type: RESET
  };
};

export const fetchUser = id => async dispatch => {
  const User = new Parse.User();
  const userQuery = new Parse.Query(User);
  const parseUser = await userQuery.get(id);
  let user = {};

  const roles = await new Parse.Query(Parse.Role).equalTo('users', parseUser).find();

  const isPharmacyOwner = roles.some(role => role.get('name') === 'pharmacyOwner');

  if (!parseUser.get('managerAsOwner') && isPharmacyOwner) {
    const Manager = Parse.Object.extend('pharmacyManagers');
    const managerQuery = new Parse.Query(Manager);
    managerQuery.equalTo('userId', {
      __type: 'Pointer',
      className: '_User',
      objectId: parseUser.id
    });

    const manager = await managerQuery.first();
    user.manager = manager;
  }

  user.roles = roles;

  dispatch(
    userFetched(
      {
        ...user,
        ...parseUser.attributes
      },
      parseUser
    )
  );
};
