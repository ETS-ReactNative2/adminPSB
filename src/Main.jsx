/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import AppRoute from './index';
import Header from './Components/Header'
import './css/general.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {getProjects, getCategories, getWelcomeHelpUs, getMembersHelpUs, getCompaniesHelpUs, getLastUpdatedDate} from './API/fetchApi';
import {signOut} from './API/authAPI';
import {getEditorStateFromHtml} from './API/draftAPI';
import {addCategory, addProject, editWelcomeEditorState, editCompaniesEditorState, editMembersEditorState, updateLastUpdatedDate} from './actions/index.js';

class Main extends Component {

    state = {
        logOut: false,
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchProjects();
        this.fetchHelpUsContent();
        this.fetchLastUpdateDate();
    }

    //Fetch all the projects from server and store them in redux
    fetchProjects = async () => {
        getProjects()
        .then(data => {
            console.log(data);
            data.map((item) => {
                this.props.addProject(item.ID, item.NAME, item.DESCRIPTION, item.START_DATE,item.COVER_IMG, item.CATEGORY, item.END_DATE, item.LOCATION);
            })
        })
        .catch ( err => console.log(err))
    }

    //Fetch the last updated date from server 
    fetchLastUpdateDate = async () => {
        getLastUpdatedDate()
        .then(data => {
            console.log(data);
            const lastUpdatedDate = data[0].VALUE;
            if(lastUpdatedDate){
                this.props.updateLastUpdatedDate(lastUpdatedDate);
            }
        })
        .catch ( err => console.log(err))
    }

    //Fetch all the categories from server and store them in redux
    fetchCategories = async () => {
        getCategories()
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
        getWelcomeHelpUs()
        .then(data => {
            console.log(data);
            this.props.editWelcomeEditorState(getEditorStateFromHtml(data[0].CONTENT));
        })
        .catch ( err => console.log(err));
        getMembersHelpUs()
        .then(data => {
            console.log(data);
            this.props.editMembersEditorState(getEditorStateFromHtml(data[0].CONTENT));
        })
        .catch ( err => console.log(err));
        getCompaniesHelpUs()
        .then(data => {
            console.log(data);
            this.props.editCompaniesEditorState(getEditorStateFromHtml(data[0].CONTENT));
        })
        .catch ( err => console.log(err));
    }

    updateSignOutStatus = () => {
        this.setState(() => {
            return {
                logOut: true
            }
        })
    }

    render() {
        const { logOut } = this.state;
        return (
            <div>
                {
                    !logOut && (
                    <Header 
                        updateSignOutStatus= {this.updateSignOutStatus}
                    />)
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
    return bindActionCreators({addCategory, addProject, editWelcomeEditorState, editCompaniesEditorState, editMembersEditorState, updateLastUpdatedDate}, dispatch);
}

export default connect(null,mapDispatchToProps)(Main);