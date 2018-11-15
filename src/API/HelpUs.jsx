import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import './../css/general.css';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {editWelcomeText} from '../actions/index.js';
import {editMembersText} from '../actions/index.js';
import {editCompaniesText} from '../actions/index.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class HelpUs extends Component{

    constructor(props) {
        super(props);
        this.state = {
            welcomeEditorState: EditorState.createEmpty(),
            membersEditorState: EditorState.createEmpty(),
            companiesEditorState: EditorState.createEmpty(),
        };
    }

    componentDidMount() {
        this.fetchHelpUsDetails();
    }

    fetchHelpUsDetails = () => {
        const welcomeText = this.props.welcomeText?this.props.welcomeText:"";
        const welcomeContentBlock = htmlToDraft(welcomeText);
        let welcomeEditorState= EditorState.createEmpty();
        if (welcomeContentBlock) {
            const welcomeContentState = ContentState.createFromBlockArray(welcomeContentBlock.contentBlocks);
            welcomeEditorState= EditorState.createWithContent(welcomeContentState);
        }
        const membersText = this.props.membersText?this.props.membersText:"";
        const membersContentBlock = htmlToDraft(membersText);
        let membersEditorState= EditorState.createEmpty();
        if (membersContentBlock) {
            const membersContentState = ContentState.createFromBlockArray(membersContentBlock.contentBlocks);
            membersEditorState= EditorState.createWithContent(membersContentState);
        }
        const companiesText = this.props.companiesText?this.props.companiesText:"";
        const companiesContentBlock = htmlToDraft(companiesText);
        let companiesEditorState= EditorState.createEmpty();
        if (companiesContentBlock) {
            const companiesContentState = ContentState.createFromBlockArray(companiesContentBlock.contentBlocks);
            companiesEditorState= EditorState.createWithContent(companiesContentState);
        }
        this.setState({
            welcomeEditorState: welcomeEditorState,
            membersEditorState: membersEditorState,
            companiesEditorState: companiesEditorState,
        });
    }

    onWelcomeEditorStateChange = (welcomeEditorState) => {
        this.setState({
          welcomeEditorState,
        });
    };

    onMembersEditorStateChange = (membersEditorState) => {
        this.setState({
          membersEditorState,
        });
    };

    onCompaniesEditorStateChange = (companiesEditorState) => {
        this.setState({
          companiesEditorState,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const welcomeText = draftToHtml(convertToRaw(this.state.welcomeEditorState.getCurrentContent()));
        const membersText = draftToHtml(convertToRaw(this.state.membersEditorState.getCurrentContent()));
        const companiesText = draftToHtml(convertToRaw(this.state.companiesEditorState.getCurrentContent()));
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
            this.props.editWelcomeText(welcomeText);
        })
        .catch((error) => {
            console.log(error);
        });
        requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME': 'MEMBERS_TEXT',
                'CONTENT': membersText
            }
        }
        API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
        .then(data => {
            console.log(data);
            this.props.editMembersText(membersText);
        })
        .catch((error) => {
            console.log(error);
        });
        requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME': 'COMPANIES_TEXT',
                'CONTENT': companiesText
            }
        }
        API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
        .then(data => {
            console.log(data);
            this.editCompaniesText(companiesText);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
                <form onSubmit={this.handleSubmit}> 
                    <div style ={{width:'80%'}}>
                        <label style={{fontSize: 14, color: 'black'}}>Texte d'accueil</label>
                        <Editor
                            editorState={this.state.welcomeEditorState}
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
                    <div style ={{width:'80%'}}>
                        <label style={{fontSize: 14, color: 'black'}}>Texte pour futurs membres</label>
                        <Editor
                            editorState={this.state.membersEditorState}
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
                    <div style ={{width:'80%'}}>
                        <label style={{fontSize: 14, color: 'black'}}>Texte pour les entreprises</label>
                        <Editor
                            editorState={this.state.companiesEditorState}
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
                    <button className='saveData' >
                        Sauvegarder
                    </button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        welcomeText: state.helpUs.welcomeText,
        membersText: state.helpUs.membersText,
        companiesText: state.helpUs.companiesText
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({editWelcomeText, editMembersText, editCompaniesText}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(HelpUs);