import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import './../css/general.css';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {editWelcomeEditorState} from '../actions/index.js';
import {editMembersEditorState} from '../actions/index.js';
import {editCompaniesEditorState} from '../actions/index.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import {Alert} from 'react-bootstrap';
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs';

class HelpUs extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentSavedState: EditorState.createEmpty(),
            saveAlert: "",
            tabIndex: 0,
            welcomeChanged: false,
            membersChanged: false,
            companiesChanged: false
        };
    }

    onWelcomeEditorStateChange = (welcomeEditorState) => {
        this.props.editWelcomeEditorState(welcomeEditorState);
        if(this.props.welcomeEditorState.getCurrentContent() != welcomeEditorState.getCurrentContent()){
            this.setState({
                welcomeChanged: true
            });
        }
    };

    onMembersEditorStateChange = (membersEditorState) => {
        this.props.editMembersEditorState(membersEditorState);        
        if(this.props.membersEditorState.getCurrentContent() != membersEditorState.getCurrentContent()){
            this.setState({
                membersChanged: true
            });
        }
    };

    onCompaniesEditorStateChange = (companiesEditorState) => {
        this.props.editCompaniesEditorState(companiesEditorState);
        if(this.props.companiesEditorState.getCurrentContent() != companiesEditorState.getCurrentContent()){
            this.setState({
                companiesChanged: true
            });
        }
    };

    handleSubmitWelcome = (event) => {
        event.preventDefault();
        const welcomeText = draftToHtml(convertToRaw(this.props.welcomeEditorState.getCurrentContent()));
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME':'WELCOME_TEXT',
                'CONTENT': welcomeText
            }
        }
        API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
        .then(data => {
            console.log(data);
            this.setState({
                welcomeChanged: false
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

    handleSubmitMembers = (event) => {
        event.preventDefault();
        const membersText = draftToHtml(convertToRaw(this.props.membersEditorState.getCurrentContent()));
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME': 'MEMBERS_TEXT',
                'CONTENT': membersText
            }
        }
        API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
        .then(data => {
            console.log(data);
            this.setState({
                membersChanged: false
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

    handleSubmitCompanies = (event) => {
        event.preventDefault();
        const companiesText = draftToHtml(convertToRaw(this.props.companiesEditorState.getCurrentContent()));
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME': 'COMPANIES_TEXT',
                'CONTENT': companiesText
            }
        }
        API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
        .then(data => {
            console.log(data);
            this.setState({
                companiesChanged: false
            });
        })
        .catch((error) => {
            console.log(error);
        });
    };

    render() {
        return (
            <div style={{width: '100%'}}> 
                <Tabs>
                    <TabList>
                        <Tab> Accueil </Tab>
                        <Tab> Devenir membre </Tab>
                        <Tab> Espace entreprises </Tab>
                    </TabList>
                    <TabPanel>
                        <form onSubmit={this.handleSubmitWelcome}>
                            <div style ={{width:'80%'}}>
                                <Editor
                                    editorState={this.props.welcomeEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorStyle"
                                    onEditorStateChange={this.onWelcomeEditorStateChange}
                                    toolbar={{
                                        image: {
                                            uploadCallback: this.uploadImageCallBack,
                                            alt: { present: true, mandatory: false },
                                            previewImage: true,
                                        },
                                    }}
                                />
                            </div>
                            {this.state.welcomeChanged?<button className='saveData'>
                                Sauvegarder
                            </button>:null}
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <form onSubmit={this.handleSubmitMembers}>
                            <div style ={{width:'80%'}}>
                                <Editor
                                    editorState={this.props.membersEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorStyle"
                                    onEditorStateChange={this.onMembersEditorStateChange}
                                    toolbar={{
                                        image: {
                                            uploadCallback: this.uploadImageCallBack,
                                            alt: { present: true, mandatory: false },
                                            previewImage: true,
                                        },
                                    }}
                                />
                            </div>
                            {this.state.membersChanged?<button className='saveData'>
                                Sauvegarder
                            </button>:null}
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <form onSubmit={this.handleSubmitCompanies}> 
                            <div style ={{width:'80%'}}>
                                <Editor
                                    editorState={this.props.companiesEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorStyle"
                                    onEditorStateChange={this.onCompaniesEditorStateChange}
                                    toolbar={{
                                        image: {
                                            uploadCallback: this.uploadImageCallBack,
                                            alt: { present: true, mandatory: false },
                                            previewImage: true,
                                        },
                                    }}
                                />
                            </div>
                            {this.state.companiesChanged?<button className='saveData'>
                                Sauvegarder
                            </button>:null}
                        </form>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        welcomeEditorState: state.helpUs.welcomeEditorState,
        membersEditorState: state.helpUs.membersEditorState,
        companiesEditorState: state.helpUs.companiesEditorState
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({editWelcomeEditorState, editCompaniesEditorState, editMembersEditorState}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(HelpUs);