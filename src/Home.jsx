import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import awsmobile from './aws-exports';
import {API} from 'aws-amplify';
import './css/general.css';

export default class Home extends Component{

    render() {
        return (
            <div className="content-text"> Bienvenue sur l'interface administrateur pour l'appli PSB </div>
        );
    }
}
