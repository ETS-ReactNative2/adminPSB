import React from 'react';
import {createStore, combineReducers} from 'redux';
import updateApp from '../reducers/reducers.js';

export const store = createStore(updateApp)