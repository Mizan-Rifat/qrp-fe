import Parse from 'parse';

//Actions

const ALL_USERS_FETCHED = 'pes/users/all_users_fetched';
const USERS_LOADING_TRUE = 'pes/users/user_loading_true';
const USERS_LOADING_FALSE = 'pes/users/user_loading_false';
const USERS_FETCHING_TRUE = 'pes/users/user_fetching_true';
const USERS_FETCHING_FALSE = 'pes/users/user_fetching_false';
const USER_DELETED = 'pes/users/user_deleted';
const USER_UPDATED = 'pes/users/user_updated';

const initState = {
  fetching: false,
  loading: true,
  staffs: [],
  pharmacyOwners: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case ALL_USERS_FETCHED:
      return {
        ...state,
        [action.payload.key]: action.payload.users,
        loading: false,
        fetching: false
      };

    case USER_DELETED:
      return {
        ...state,
        loading: false,
        users: state.users.filter(user => user.id != action.payload)
      };
    case USER_UPDATED:
      return {
        ...state,
        loading: false,
        users: state.users.map(user => (user.id == action.payload.id ? action.payload : user))
      };

    case USERS_LOADING_TRUE:
      return {
        ...state,
        loading: true
      };

    case USERS_LOADING_FALSE:
      return {
        ...state,
        loading: false
      };
    case USERS_FETCHING_TRUE:
      return {
        ...state,
        fetching: true
      };

    case USERS_FETCHING_FALSE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
};

export const allUsersFetched = (users, key) => {
  return {
    type: ALL_USERS_FETCHED,
    payload: { users, key }
  };
};

export const userDeleted = id => {
  return {
    type: USER_DELETED,
    payload: id
  };
};
export const userUpdated = user => {
  return {
    type: USER_UPDATED,
    payload: user
  };
};

export const fetchUsers = (type, key) => async dispatch => {
  dispatch({ type: USERS_FETCHING_TRUE });

  const User = new Parse.User();
  const userQuery = new Parse.Query(User);
  userQuery.containedIn('userType', type);
  const parseUsers = await userQuery.find().catch(err => {
    dispatch({ type: USER_FETCHING_FALSE });
    return Promise.reject(err);
  });

  const data = parseUsers.map(user => ({
    id: user.id,
    ...user.attributes,
    name: `${user.get('firstName')} ${user.get('lastName')}`
  }));
  dispatch(allUsersFetched(data, key));
};
