import { combineReducers } from 'redux';
import usersReducer from '../ducks/usersDuck';
import userReducer from '../ducks/userDuck';

export const reducers = combineReducers({
  users: usersReducer,
  user: userReducer
});
