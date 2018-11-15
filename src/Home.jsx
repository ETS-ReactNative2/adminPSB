import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import {API} from 'aws-amplify';
import './css/general.css';
import { connect } from 'react-redux';

class Home extends Component{

    render() {
        return (
            <div 
            className="content-text"
            style={{marginLeft: 30}}> 
                Bienvenue sur l'interface administrateur pour l'appli PSB
                <div
                style={{marginTop: 50}}>
                    Il y a actuellement :
                    <ul
                    style={{marginLeft:20}}
                    >
                        <li>- {this.props.categories.length} categories</li>
                        <li>- {this.props.projects.length} projets en cours</li>
                        <li>- O projets à venir</li>
                        <li>- P membres</li>
                    </ul>
                </div>
                <div
                    style={{marginTop: 50}}>
                    Dernière mise à jour : le 21-02-2018
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        projects: state.projects
    }
}

export default connect(mapStateToProps,null)(Home);
