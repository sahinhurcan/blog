import { createStore, combineReducers } from 'redux';

/* SESSION */

const applySetAuthUser = (state, action) => ({
    ...state,
    authUser: action.authUser,
});

const sessionReducer = (state={authUser: null}, action) => {
    switch(action.type) {
        case 'AUTH_USER_SET': {
            return applySetAuthUser(state, action);
        }
        default: return state;
    }
}

/* USER */

const applySetUsers = (state, action) => ({
    ...state,
    users: action.users,
});

const userReducer = (state={users: []}, action) => {
    switch(action.type) {
        case 'USERS_SET': {
            return applySetUsers(state, action);
        }
        default: return state;
    }
}

/* ROOT REDUCER */

const rootReducer = combineReducers({
    sessionState: sessionReducer,
    userState: userReducer
});

/* initStore */
export const initStore = () => createStore(rootReducer);