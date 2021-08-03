import Parse from 'parse';
//actions

const CONTACTS_FETCHED = 'qrp/contacts/contacts_fetched';
const CONTACTS_UPDATED = 'qrp/contacts/contacts_updated';
const SET_UNSEEN_MESSAGE = 'qrp/contacts/has_unseen_message';

const LOADING_TRUE = 'qrp/contacts/loading_true';
const LOADING_FALSE = 'qrp/contacts/loading_false';
const FETCHING_TRUE = 'qrp/contacts/fetching_true';
const FETCHING_FALSE = 'qrp/contacts/fetching_false';
const SET_ERROR = 'qrp/contacts/set_error';

// reducers

const initState = {
  fetching: true,
  loading: false,
  contacts: [],
  unseenMessages: 0,
  error: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case CONTACTS_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        contacts: action.payload,
        unseenMessages: action.payload.reduce(
          (acc, contact) => (contact.unseenCount ? acc + 1 : acc),
          0
        )
      };
    case CONTACTS_UPDATED:
      return {
        ...state,
        fetching: false,
        loading: false,
        contacts: state.contacts.map(item => (item.id == action.payload.id ? action.payload : item))
      };
    case SET_UNSEEN_MESSAGE:
      return {
        ...state,
        unseenMessages: action.payload
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
    case SET_ERROR:
      return {
        ...state,
        fetching: false,
        loading: false,
        error: action.payload
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
export const setContactsError = error => {
  return {
    type: SET_ERROR,
    payload: error
  };
};

export const fetchContacts = () => async dispatch => {
  dispatch({ type: FETCHING_TRUE });

  const contacts = await Parse.Cloud.run('contacts').catch(err => {
    dispatch(setContactsError(err));
    return Promise.reject(err);
  });

  dispatch(contactsFetched(contacts));
};

export const setPresenceStatus = (id, status) => (dispatch, getState) => {
  const contact = getState().contacts.contacts.find(contact => contact.id === id);
  if (contact) {
    dispatch({ type: CONTACTS_UPDATED, payload: { ...contact, online: status } });
  }
};

export const setUnseenMessage = contacts => {
  return {
    type: SET_UNSEEN_MESSAGE,
    payload: contacts.reduce((acc, contact) => (contact.unseenCount ? acc + 1 : acc), 0)
  };
};

export const setSeen = rid => async (dispatch, getState) => {
  dispatch({ type: LOADING_TRUE });
  const contact = getState().contacts.contacts.find(contact => contact.id === rid);
  if (contact) {
    dispatch({ type: CONTACTS_UPDATED, payload: { ...contact, unseenCount: 0 } });
  }
  dispatch(setUnseenMessage(getState().contacts.contacts));
  const messages = await Parse.Cloud.run('setSeen', {
    rid
  });
};

export const setUnseenCount = (rid, message) => async (dispatch, getState) => {
  const contact = getState().contacts.contacts.find(contact => contact.id === rid);
  const recipient = getState().messages.recipient;
  if (contact) {
    dispatch({
      type: CONTACTS_UPDATED,
      payload: {
        ...contact,
        unseenCount: contact.id !== recipient.id ? contact.unseenCount + 1 : contact.unseenCount,
        lastMessage: message
      }
    });
  }
  dispatch(setUnseenMessage(getState().contacts.contacts));
};
