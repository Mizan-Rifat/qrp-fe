import Parse from 'parse';

//Actions

const USER_FETCHED = 'pes/user/users_fetched';
const USER_LOADING_TRUE = 'pes/user/user_loading_true';
const USER_LOADING_FALSE = 'pes/user/user_loading_false';
const USER_FETCHING_TRUE = 'pes/user/user_fetching_true';
const USER_FETCHING_FALSE = 'pes/user/user_fetching_false';
const USER_UPDATED = 'pes/user/user_updated';

const initState = {
  fetching: true,
  loading: true,
  user: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case USER_FETCHED:
      return {
        ...state,
        user: action.payload,
        loading: false,
        fetching: false
      };

    case USER_UPDATED:
      return {
        ...state,
        loading: false,
        user: state.user.map(user => (user.id == action.payload.id ? action.payload : user))
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

    default:
      return state;
  }
};

export const userFetched = user => {
  return {
    type: USER_FETCHED,
    payload: user
  };
};

export const userUpdated = user => {
  return {
    type: USER_UPDATED,
    payload: user
  };
};

export const fetchUser = id => async dispatch => {
  const User = new Parse.User();
  const userQuery = new Parse.Query(User);
  const user = await userQuery.get(id);
  console.log(user.attributes);
  dispatch(userFetched(user));
};
