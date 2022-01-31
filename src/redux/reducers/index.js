import { combineReducers } from 'redux';
import usersReducer from '../ducks/usersDuck';
import userReducer from '../ducks/userDuck';
import messagesReducer from '../ducks/messagesDuck';
import contactsReducer from '../ducks/contactsDuck';
import questionnaireReducer from '../ducks/questionnaireDuck';
import emergencyShiftsReducer from 'redux/ducks/emergencyShiftsDuck';
import shiftsReducer from 'redux/ducks/shiftsDuck';
import shiftReducer from 'redux/ducks/shiftDuck';

export const reducers = combineReducers({
  users: usersReducer,
  user: userReducer,
  contacts: contactsReducer,
  messages: messagesReducer,
  questionnaire: questionnaireReducer,
  emergencyShifts: emergencyShiftsReducer,
  shifts: shiftsReducer,
  shift: shiftReducer
});
