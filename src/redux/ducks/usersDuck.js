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
        [action.payload.userType]: state[action.payload.userType].filter(
          user => user.id !== action.payload.id
        )
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

export const userDeleted = payload => {
  return {
    type: USER_DELETED,
    payload
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
  let users = [];
  const User = new Parse.User();
  const userQuery = new Parse.Query(User);
  userQuery.containedIn('userType', type);
  userQuery.limit(1000);
  userQuery.descending('createdAt');
  userQuery.withCount();
  const getUsers = async () => {
    userQuery.skip(users.length);
    const result = await userQuery.find().catch(err => {
      dispatch({ type: USER_FETCHING_FALSE });
      return Promise.reject(err);
    });
    users = [...users, ...result.results];
    if (result && result.count > users.length) {
      await getUsers();
    }
  };
  await getUsers();
  const data = users.map(user => ({
    id: user.id,
    ...user.attributes,
    name: `${user.get('firstName')} ${user.get('lastName')}`
  }));
  dispatch(allUsersFetched(data, key));
};

export const deleteUser = (id, userType) => async dispatch => {
  dispatch({ type: USERS_LOADING_TRUE });
  const res = await Parse.Cloud.run('deleteUser', {
    userId: id
  }).catch(err => {
    dispatch({ type: USERS_LOADING_FALSE });
    return Promise.reject(err);
  });

  dispatch(userDeleted({ id, userType }));
  dispatch({ type: USERS_LOADING_FALSE });

  return Promise.resolve(res);
};
