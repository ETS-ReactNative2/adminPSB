/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import Home from '../Home';
import Projects from '../Containers/ProjectsContainer';
import Categories from '../Containers/CategoriesContainer';
import HelpUs from '../Containers/HelpUsContainer';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import '../css/general.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {signOut} from '../API/authAPI';
import {cleanProjects, cleanCategories} from '../actions/index.js';
import PropTypes from 'prop-types';
import * as Constants from '../Globals/Constants'
import {FormattedMessage} from 'react-intl';

class Header extends Component {
    
    static propTypes = {
        updateSignOutStatus: PropTypes.func
    };

    //Sign out user
    signOut = async(e) => {
        e.preventDefault();
        signOut()
        .then(
            sessionStorage.setItem('isLoggedIn', false),
            this.props.cleanCategories(),
            this.props.cleanProjects(),
            this.props.updateSignOutStatus()
        )
        .catch(err => console.log(err));    
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <div className='nav-bar'>
                        <Link className="menu-item" to="/main">
                        <FormattedMessage
                            id="Header.accueil"
                            defaultMessage="Accueil"
                        />
                        </Link>
                        <Link className="menu-item" to="/categories">
                            <FormattedMessage
                                id="Header.categories"
                                defaultMessage="Catégories"
                            />
                        </Link>
                        <Link className="menu-item" to="/projects">
                            <FormattedMessage
                                id="Header.projects"
                                defaultMessage="Projets"
                            />
                        </Link>
                        <Link className="menu-item" to="/helpus">
                            <FormattedMessage
                                id="Header.helpus"
                                defaultMessage="Nous aider"
                            />
                        </Link>
                        <div 
                        className="menu-item" 
                        onClick={this.signOut}>
                            <FormattedMessage
                                id="Header.logout"
                                defaultMessage="Se déconnecter"
                            />
                        </div>
                    </div>
                    <div className="welcome-content" >
                        <img src={Constants.HOME_LOGO_PATH} 
                        height="50" />
                        <div className="welcome-title"> 
                            <FormattedMessage
                                id="Header.title"
                                defaultMessage="Interface admin pour PSB App"
                            />
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/main" component={Home} />
                        <Route exact path="/projects" component={Projects} />
                        <Route exact path="/categories" component={Categories} />
                        <Route exact path="/helpus" component={HelpUs} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

//Redux
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({cleanProjects, cleanCategories}, dispatch);
}

export default connect(null,mapDispatchToProps)(Header);