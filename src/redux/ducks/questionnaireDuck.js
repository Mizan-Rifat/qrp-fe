import Parse from 'parse';
//actions
const QUESTIONNAIRE_FETCHED = 'qrp/questionnaire/questionnaire_fetched';
const LOADING_TRUE = 'qrp/questionnaire/loading_true';
const LOADING_FALSE = 'qrp/questionnaire/loading_false';
const FETCHING_TRUE = 'qrp/questionnaire/fetching_true';
const FETCHING_FALSE = 'qrp/questionnaire/fetching_false';
const RESET = 'qrp/questionnaire/reset';

// reducers

const initState = {
  fetching: true,
  loading: false,
  questionnaire: [],
  error: {}
};

export default (state = initState, action) => {
  switch (action.type) {
    case QUESTIONNAIRE_FETCHED:
      return {
        ...state,
        fetching: false,
        loading: false,
        questionnaire: action.payload
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
    case RESET:
      return initState;

    default:
      return state;
  }
};

// action_creators
export const questionnaireFetched = questionnaire => {
  return {
    type: QUESTIONNAIRE_FETCHED,
    payload: questionnaire
  };
};
export const resetQuestionnaireState = () => {
  return {
    type: RESET
  };
};

export const fetchQuestionnaire = user => async dispatch => {
  const Questionnaires = Parse.Object.extend('Questionnaires');
  const questionnairesQuery = new Parse.Query(Questionnaires);

  questionnairesQuery.equalTo('userId', user);
  const questionnaires = await questionnairesQuery.find().catch(err => {
    dispatch({ type: FETCHING_FALSE });
    return Promise.reject(err);
  });

  dispatch(
    questionnaireFetched(
      questionnaires.map(questionnaire => ({
        id: questionnaire.id,
        ...questionnaire.attributes
      }))
    )
  );
};
