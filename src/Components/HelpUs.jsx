import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import './../css/api.css';
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
import {postHelpUsDescription, postHelpUsMembers, postHelpUsCompanies}  from "../API/fetchApi";

class HelpUs extends Component{

    static propTypes = {
        displayNotification: PropTypes.func
    };

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

    //Update client state after user edit welcome field
    onWelcomeEditorStateChange = (welcomeEditorState) => {
        this.props.editWelcomeEditorState(welcomeEditorState);
        if(this.props.welcomeEditorState.getCurrentContent() != welcomeEditorState.getCurrentContent()){
            this.setState({
                welcomeChanged: true
            });
        }
    };

    //Update client state after user edit members field
    onMembersEditorStateChange = (membersEditorState) => {
        this.props.editMembersEditorState(membersEditorState);        
        if(this.props.membersEditorState.getCurrentContent() != membersEditorState.getCurrentContent()){
            this.setState({
                membersChanged: true
            });
        }
    };

    //Update client state after user edit companies field
    onCompaniesEditorStateChange = (companiesEditorState) => {
        this.props.editCompaniesEditorState(companiesEditorState);
        if(this.props.companiesEditorState.getCurrentContent() != companiesEditorState.getCurrentContent()){
            this.setState({
                companiesChanged: true
            });
        }
    };

    //Post to server the changes for welcome field
    handleSubmitWelcome = (event) => {
        event.preventDefault();
        const welcomeText = draftToHtml(convertToRaw(this.props.welcomeEditorState.getCurrentContent()));
        postHelpUsDescription(welcomeText)
        .then(data => {
            console.log(data);
            this.setState({
                welcomeChanged: false
            });
            this.props.displayNotification("success","Modification sauvegardée.");
        })
        .catch((error) => {
            console.log(error);
            this.props.displayNotification("error","Erreur lors de la sauvegarde.");
        });
    };

    //Post to server the changes for members field
    handleSubmitMembers = (event) => {
        event.preventDefault();
        const membersText = draftToHtml(convertToRaw(this.props.membersEditorState.getCurrentContent()));
        postHelpUsMembers(membersText)
        .then(data => {
            console.log(data);
            this.setState({
                membersChanged: false
            });
            this.props.displayNotification("success","Modification sauvegardée.");
        })
        .catch((error) => {
            console.log(error);
            this.props.displayNotification("error","Erreur lors de la sauvegarde.");
        });
    };

    //Post to server the changes for companies field
    handleSubmitCompanies = (event) => {
        event.preventDefault();
        const companiesText = draftToHtml(convertToRaw(this.props.companiesEditorState.getCurrentContent()));
        postHelpUsCompanies(companiesText)
        .then(data => {
            console.log(data);
            this.setState({
                companiesChanged: false
            });
            this.props.displayNotification("success","Modification sauvegardée.");
        })
        .catch((error) => {
            console.log(error);
            this.props.displayNotification("error","Erreur lors de la sauvegarde.");
        });
    };

    render() {
        return (
            <div style={{width: '100%'}}> 
                <Tabs>
                    <TabList>
                        <Tab style={{marginLeft: '30px'}}> Accueil </Tab>
                        <Tab> Devenir membre </Tab>
                        <Tab> Espace entreprises </Tab>
                    </TabList>
                    <TabPanel className="tab-panel-style">
                        <form onSubmit={this.handleSubmitWelcome}>
                            <div>
                                <Editor
                                    editorState={this.props.welcomeEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editor-style2"
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
                    <TabPanel className="tab-panel-style">
                        <form onSubmit={this.handleSubmitMembers}>
                            <div>
                                <Editor
                                    editorState={this.props.membersEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editor-style2"
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
                    <TabPanel className="tab-panel-style">
                        <form onSubmit={this.handleSubmitCompanies}> 
                            <div>
                                <Editor
                                    editorState={this.props.companiesEditorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editor-style2"
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