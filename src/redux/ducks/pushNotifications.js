//actions

const NOTIFICATIONS_FETCHED = 'qrp/notifications/notifications_fetched';
const NOTIFICATIONS_ADDED = 'qrp/notifications/notifications_added';
const NOTIFICATIONS_DELETED = 'qrp/notifications/notifications_deleted';
const NOTIFICATIONS_UPDATED = 'qrp/notifications/notifications_updated';

const LOADING_TRUE = 'qrp/notifications/loading_true';
const LOADING_FALSE = 'qrp/notifications/loading_false';
const FETCHING_TRUE = 'qrp/notifications/fetching_true';
const FETCHING_FALSE = 'qrp/notifications/fetching_false';
const SET_ERRORS = 'qrp/notifications/set_errors';

// reducers

const initState = {
  fetching: true,
  loading: false,
  notifications: [],
  error: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case NOTIFICATIONS_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        notifications: action.payload
      };

    case NOTIFICATIONS_ADDED:
      return {
        ...state,
        loading: false,
        notifications: [...state.notifications, action.payload]
      };
    case NOTIFICATIONS_UPDATED:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map(item =>
          item.id == action.payload.id ? action.payload : item
        )
      };
    case NOTIFICATIONS_DELETED:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.filter(item => item.id != action.payload)
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

    default:
      return state;
  }
};

// action_creators

export const notificationsFetched = data => {
  return {
    type: NOTIFICATIONS_FETCHED,
    payload: data
  };
};

export const notificationsUpdated = data => {
  return {
    type: NOTIFICATIONS_UPDATED,
    payload: data
  };
};
export const notificationsDeleted = id => {
  return {
    type: NOTIFICATIONS_DELETED,
    payload: id
  };
};
export const notificationsAdded = data => {
  return {
    type: NOTIFICATIONS_ADDED,
    payload: data
  };
};

export const setErrors = error => {
  return {
    type: SET_ERRORS,
    payload: error
  };
};

export const fetchNotifications = () => dispatch => {
  const url = fetch_notifications_url;
  const actions = {
    loading: { type: FETCHING_TRUE },
    success: notificationsFetched,
    error: setErrors
  };
  return getAction(actions, url, dispatch);
};

export const addNotifications = newData => dispatch => {
  const url = add_notifications_url;
  const actions = {
    loading: { type: LOADING_TRUE },
    success: notificationsAdded,
    error: setErrors
  };
  return postAction(actions, url, newData, dispatch);
};

export const updateNotifications = newData => dispatch => {
  const url = update_notifications_url();
  const actions = {
    loading: { type: LOADING_TRUE },
    success: notificationsUpdated,
    error: setErrors
  };
  return postAction(actions, url, newData, dispatch, 'put');
};

export const deleteNotifications = id => dispatch => {
  const url = delete_notifications_url(id);
  const actions = {
    loading: { type: LOADING_TRUE },
    success: notificationsDeleted,
    error: setErrors
  };
  return postAction(actions, url, {}, dispatch, 'delete');
};
