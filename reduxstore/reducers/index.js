import {combineReducers} from 'redux';

import userReducer from "./userReducer";

import configRedu from "./configReducercambiado";

import RegContableReducer from "./regreducer";

export default combineReducers({
 
    userReducer,
    RegContableReducer,
    configRedu,
 
});
