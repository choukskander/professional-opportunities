import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  jobListReducer,
  jobDetailsReducer,
  jobCreateReducer,
  jobUpdateReducer,
  jobDeleteReducer,
} from './reducers/jobReducers';
import {
  userLoginReducer,
  // Autres réducteurs utilisateurs
} from './reducers/userReducers';

const reducer = combineReducers({
  jobList: jobListReducer,
  jobDetails: jobDetailsReducer,
  jobCreate: jobCreateReducer,
  jobUpdate: jobUpdateReducer,
  jobDelete: jobDeleteReducer,
  userLogin: userLoginReducer,
  // Autres réducteurs...
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
