import Parse from 'parse';
import { getParseObject } from 'utils';
//actions

const CONTACTS_FETCHED = 'qrp/contacts/contacts_fetched';
const CONTACTS_UPDATED = 'qrp/contacts/contacts_updated';

const LOADING_TRUE = 'qrp/contacts/loading_true';
const LOADING_FALSE = 'qrp/contacts/loading_false';
const FETCHING_TRUE = 'qrp/contacts/fetching_true';
const FETCHING_FALSE = 'qrp/contacts/fetching_false';

// reducers

const initState = {
  fetching: true,
  loading: false,
  contacts: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case CONTACTS_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        contacts: action.payload
      };
    case CONTACTS_UPDATED:
      return {
        ...state,
        fetching: false,
        loading: false,
        contacts: state.contacts.map(item => (item.id == action.payload.id ? action.payload : item))
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

    default:
      return state;
  }
};

// action_creators

export const contactsFetched = data => {
  return {
    type: CONTACTS_FETCHED,
    payload: data
  };
};
export const contactsUpdated = data => {
  return {
    type: CONTACTS_UPDATED,
    payload: data
  };
};

export const fetchContacts = () => async dispatch => {
  dispatch({ type: FETCHING_TRUE });

  const uid = Parse.User.current().id;

  const User = new Parse.User();
  const userQuery = new Parse.Query(User);
  const users = await userQuery.find();

  const dataFields = ['username', 'firstName', 'lastName', 'online', 'profilePicture'];
  const data = users.map(user => ({
    ...getParseObject(user, dataFields)
  }));

  dispatch(contactsFetched(data.filter(user => user.id !== uid)));
};

export const setPresenceStatus = (id, status) => (dispatch, getState) => {
  const contact = getState().contacts.contacts.find(contact => contact.id === id);
  if (contact) {
    dispatch({ type: CONTACTS_UPDATED, payload: { ...contact, online: status } });
  }
};
