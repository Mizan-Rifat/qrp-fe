import { combineReducers } from 'redux';
import usersReducer from '../ducks/usersDuck';
import userReducer from '../ducks/userDuck';
import messagesReducer from '../ducks/messagesDuck';
import contactsReducer from '../ducks/contactsDuck';

export const reducers = combineReducers({
  users: usersReducer,
  user: userReducer,
  contacts: contactsReducer,
  messages: messagesReducer
});
