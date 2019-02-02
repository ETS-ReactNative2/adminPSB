/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import Home from './Home';
import Projects from './API/Projects';
import Categories from './API/Categories';
import HelpUs from './API/HelpUs';
import Login from './Auth/Login';
import AppRoute from './index';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './css/general.css';
import {Auth} from 'aws-amplify';
import {API} from 'aws-amplify';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {addCategory} from './actions/index.js'
import {addProject} from './actions/index.js'
import {cleanProjects} from './actions/index.js';
import {cleanCategories} from './actions/index.js';
import {editWelcomeEditorState} from './actions/index.js';
import {editCompaniesEditorState} from './actions/index.js';
import {editMembersEditorState} from './actions/index.js';

class Main extends Component {

    state = {
        logOut: false,
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchProjects();
        this.fetchHelpUsContent();
    }

    //Fetch all the projects from server and store them in redux
    fetchProjects = async () => {
        API.get('PROJECTSCRUD','/PROJECTS')
            .then(data => {
                console.log(data);
                data.map((item) => {
                    this.props.addProject(item.ID, item.NAME, item.DESCRIPTION, item.START_DATE,item.COVER_IMG, item.CATEGORY, item.END_DATE, item.LOCATION);
                })
            })
            .catch ( err => console.log(err))
    }

    //Fetch all the categories from server and store them in redux
    fetchCategories = async () => {
        API.get('CATEGORIESCRUD','/CATEGORIES')
            .then(data => {
                console.log(data);
                data.map((item) => {
                    this.props.addCategory(item.NAME);
                })
            })
            .catch ( err => console.log(err));
    }

    //Fetch all the content linked to Helpus category and store it in redux
    fetchHelpUsContent = async () => {
        API.get('DESCRIPTIONCRUD','/DESCRIPTION/WELCOME_TEXT')
            .then(data => {
                console.log(data);
                const welcomeText = data[0].CONTENT;
                const welcomeContentBlock = htmlToDraft(welcomeText);
                let welcomeEditorState= EditorState.createEmpty();
                if (welcomeContentBlock) {
                    const welcomeContentState = ContentState.createFromBlockArray(welcomeContentBlock.contentBlocks);
                    welcomeEditorState= EditorState.createWithContent(welcomeContentState);
                }
                this.props.editWelcomeEditorState(welcomeEditorState);
            })
            .catch ( err => console.log(err));
        API.get('DESCRIPTIONCRUD','/DESCRIPTION/MEMBERS_TEXT')
            .then(data => {
                console.log(data);
                const membersText = data[0].CONTENT;
                const membersContentBlock = htmlToDraft(membersText);
                let membersEditorState= EditorState.createEmpty();
                if (membersContentBlock) {
                    const membersContentState = ContentState.createFromBlockArray(membersContentBlock.contentBlocks);
                    membersEditorState= EditorState.createWithContent(membersContentState);
                }
                this.props.editMembersEditorState(membersEditorState);
            })
            .catch ( err => console.log(err));
        API.get('DESCRIPTIONCRUD','/DESCRIPTION/COMPANIES_TEXT')
            .then(data => {
                console.log(data);
                const companiesText = data[0].CONTENT;
                const companiesContentBlock = htmlToDraft(companiesText);
                let companiesEditorState= EditorState.createEmpty();
                if (companiesContentBlock) {
                    const companiesContentState = ContentState.createFromBlockArray(companiesContentBlock.contentBlocks);
                    companiesEditorState= EditorState.createWithContent(companiesContentState);
                }
                this.props.editCompaniesEditorState(companiesEditorState);
            })
            .catch ( err => console.log(err));
    }

    //Sign out user
    signOut = async(e) => {
        e.preventDefault();
        Auth.signOut()
            .then(
                sessionStorage.setItem('isLoggedIn', false),
                this.props.cleanCategories(),
                this.props.cleanProjects(),
                this.setState(() => {
                    return {
                        logOut: true
                    }
                })
            )
            .catch(err => console.log(err));    
    }

    render() {
        const { logOut } = this.state;
        return (
            <div>
                {
                    !logOut && (
                    <BrowserRouter>
                        <div>
                            <div className='nav-bar'>
                                <Link className="menu-item" to="/main">Accueil</Link>
                                <Link className="menu-item" to="/categories">Catégories</Link>
                                <Link className="menu-item" to="/projects">Projets</Link>
                                <Link className="menu-item" to="/helpus">Nous aider</Link>
                                <div 
                                className="menu-item" 
                                onClick={this.signOut}>
                                    Se déconnecter
                                </div>
                            </div>
                            <div className="welcome-content" >
                                <img src={require('./Images/homeLogo.png')} 
                                height="50" />
                                <div className="welcome-title"> Interface admin pour PSB App</div>
                            </div>
                            <Switch>
                                <Route exact path="/main" component={Home} />
                                <Route exact path="/projects" component={Projects} />
                                <Route exact path="/categories" component={Categories} />
                                <Route exact path="/helpus" component={HelpUs} />
                            </Switch>
                        </div>
                    </BrowserRouter>)
                }
                {
                    logOut && (<AppRoute authStatus={false}/>)
                }
            </div>
        );
    }
}

//Redux
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addCategory, addProject, cleanProjects, cleanCategories, editWelcomeEditorState, editCompaniesEditorState, editMembersEditorState}, dispatch);
}

export default connect(null,mapDispatchToProps)(Main);