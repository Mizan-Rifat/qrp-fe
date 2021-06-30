import Parse from 'parse';
import { getParseObject } from 'utils';

//Actions

const ALL_USERS_FETCHED = 'pes/users/all_users_fetched';
const USERS_LOADING_TRUE = 'pes/users/user_loading_true';
const USERS_LOADING_FALSE = 'pes/users/user_loading_false';
const USERS_FETCHING_TRUE = 'pes/users/user_fetching_true';
const USERS_FETCHING_FALSE = 'pes/users/user_fetching_false';
const USER_DELETED = 'pes/users/user_deleted';
const USER_UPDATED = 'pes/users/user_updated';

const initState = {
  fetching: true,
  loading: true,
  users: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case ALL_USERS_FETCHED:
      return {
        ...state,
        users: action.payload,
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

export const allUsersFetched = users => {
  return {
    type: ALL_USERS_FETCHED,
    payload: users
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

export const fetchUsers = type => async dispatch => {
  dispatch({ type: USERS_FETCHING_TRUE });
  const roleQuery = new Parse.Query(Parse.Role);
  roleQuery.containedIn('name', type);
  const roles = await roleQuery.find();
  const roleUsers = await roles.reduce(async (acc, role) => {
    acc = await acc;
    const usersQuery = role.relation('users').query();
    const allUsers = await usersQuery.find();

    allUsers.forEach(user => {
      user.roleName = role.get('name');
    });

    return [...acc, ...allUsers];
  }, Promise.resolve([]));

  console.log({ roleUsers });

  const dataFields = [
    'firstName',
    'lastName',
    'customEmail',
    'profilePicture',
    'phone',
    'city',
    'country'
  ];
  const data = roleUsers.map(user => ({
    ...getParseObject(user, dataFields),
    type: user.roleName
  }));
  dispatch(allUsersFetched(data));
};
