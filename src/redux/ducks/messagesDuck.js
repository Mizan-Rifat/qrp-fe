import Parse from 'parse';

//actions

const MESSAGES_FETCHED = 'qrp/messages/messages_fetched';
const MESSAGE_ADDED = 'qrp/messages/messages_added';
const MESSAGES_DELETED = 'qrp/messages/messages_deleted';
const MESSAGES_UPDATED = 'qrp/messages/messages_updated';
const MORE_MESSAGES_LOADED = 'qrp/messages/more_messages_loaded';

const LOADING_TRUE = 'qrp/messages/loading_true';
const LOADING_FALSE = 'qrp/messages/loading_false';
const FETCHING_TRUE = 'qrp/messages/fetching_true';
const FETCHING_FALSE = 'qrp/messages/fetching_false';
const SET_ERRORS = 'qrp/messages/set_errors';
const RESET = 'qrp/messages/reset';
// reducers

const initState = {
  fetching: true,
  loading: false,
  messages: [],
  count: 0,
  error: false
};

export default (state = initState, action) => {
  switch (action.type) {
    case MESSAGES_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        messages: action.payload.results,
        count: action.payload.count,
        error: false
      };
    case MORE_MESSAGES_LOADED:
      return {
        ...state,
        loading: false,
        messages: [...action.payload.results, ...state.messages],
        count: action.payload.count,
        error: false
      };

    case MESSAGE_ADDED:
      return {
        ...state,
        loading: false,
        messages: [...state.messages, action.payload],
        count: state.count + 1,
        error: false
      };

    case MESSAGES_UPDATED:
      return {
        ...state,
        loading: false,
        messages: state.messages.map(item =>
          item.id == action.payload.id ? action.payload : item
        ),
        error: false
      };
    case MESSAGES_DELETED:
      return {
        ...state,
        loading: false,
        messages: state.messages.filter(item => item.id != action.payload),
        error: false
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
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        fetching: false,
        error: action.payload
      };
    case RESET:
      return initState;

    default:
      return state;
  }
};

// action_creators

export const messagesFetched = data => {
  return {
    type: MESSAGES_FETCHED,
    payload: data
  };
};

export const receiveMessage = message => {
  return {
    type: MESSAGE_ADDED,
    payload: message
  };
};
export const moreMessageLoaded = data => {
  return {
    type: MORE_MESSAGES_LOADED,
    payload: data
  };
};
export const setErrors = error => {
  return {
    type: SET_ERRORS,
    payload: error
  };
};

export const resetMessagesState = () => {
  return {
    type: RESET
  };
};

export const fetchMessages = (rid, page) => async dispatch => {
  dispatch({ type: FETCHING_TRUE });
  try {
    const messages = await Parse.Cloud.run('messages', {
      rid,
      page,
      limit: 5
    });
    dispatch(messagesFetched(messages));
  } catch (err) {
    dispatch(setErrors(err));
  }
};

export const loadMoreMessages = (rid, page) => async dispatch => {
  dispatch({ type: LOADING_TRUE });
  const messages = await Parse.Cloud.run('messages', {
    rid,
    page,
    limit: 5
  });
  dispatch(moreMessageLoaded(messages));
};
