import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import './../css/api.css';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {editProject} from '../actions/index.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {putProject, postLastUpdatedDate} from '../API/fetchApi';
import {defineMessages} from 'react-intl';
import * as Constants from '../Globals/Constants';

class ExistingProjectModal extends Component {

    static propTypes = {
        selectedProjectId: PropTypes.number.isRequired,
        displayNotification: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            category: '',
            name: '',
            startDate: '',
            endDate: '',
            description: '',
            coverImage: '',
            editMode: false,
            location: '',
            editorState: EditorState.createEmpty(),
        };
    }

    componentWillMount() {
        this.fetchProjectDetails();
    }

    //Get project details redux
    fetchProjectDetails = () => {
        this.props.projects.map((project)=> {
            if(project.id == this.props.selectedProjectId){
                const description = project.description;
                const contentBlock = htmlToDraft(description);
                let editorState= EditorState.createEmpty();
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    editorState= EditorState.createWithContent(contentState);
                }
                this.setState({
                    category: project.category,
                    name: project.name,
                    startDate: project.startDate,
                    endDate: project.endDate,
                    description: description,
                    editorState: editorState,
                    coverImage:project.coverImg,
                    location: project.location
                });
            }
        })
    }

    //Post project details changes to server
    handleSubmit = (event) => {
        event.preventDefault();
        const messages = defineMessages({
            successMessage: {
              id: "Projects.projectUpdatedWithSuccess",
              defaultMessage: "Projet mis à jour.",
            },
            errorMessage: {
                id: "Projects.errorWhileUpdatingProject",
                defaultMessage: "Erreur lors de la mise à jour.",
              },
          });
        const id = this.props.selectedProjectId;
        const description = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        const {name, startDate, endDate, coverImage, category, location} = this.state;
        postProject(id, name, description, startDate, category, coverImage, location)
        .then(data => {
            console.log(data);
            this.props.editProject(id,name,description,startDate, coverImage, category, endDate, location);
            this.props.displayNotification("success",messages.successMessage);
            updateLastUpdatedDate();
        })
        .catch((error) => {
            console.log(error);
            this.props.displayNotification("error",messages.errorMessage);
        });
        this.switchEditMode();
    };

    //Update project value after user while the user is filling the form
    handleChange = (event) => {
        const target = event.target;
        if(target){
            this.setState({
            [ target.name]: target.value
            });
        }
    }

    //Update the content of Editor while the user is filling it
    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
    };

    //Switch between editing and non editing modes
    switchEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
          });
    }

    render() {
        const {editorState} = this.state;
        return (
            <div >
                <div className="row-content">                    
                    <div className="row-content">
                        { !this.state.editMode &&
                            <img src={Constants.EDIT_ICON_PATH} 
                                onClick={() => {this.switchEditMode();}}
                                className="icon-style"
                                width="20" 
                                height="20" 
                            />
                        }
                        <div className="content">
                            <div style={{fontSize: '16px'}}> {this.state.name} </div>
                            <div>{this.state.category}</div>
                            <div>{this.state.startDate}</div>
                            { !this.state.editMode && <div>{this.state.location}</div>}
                        </div>
                    </div>
                    <div>
                        <img className="imgPreview" src={this.state.coverImage}/>
                    </div>
                </div>
                { !this.state.editMode &&
                    <Editor
                        readOnly
                        toolbarHidden
                        style={{height:"25%"}}
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor-style2"
                        onEditorStateChange={this.onEditorStateChange}
                    />
                }
                { this.state.editMode && <form onSubmit={this.handleSubmit}> 
                    <br />
                    <label>Date de fin</label>
                    <input name="endDate" style={{width: 150}} row="1"  type="date" value={this.state.endDate} onChange={this.handleChange} />
                    <br />
                    <label>Lieu<span className="required">*</span></label>
                    <input name="location" row="1" type="text" value={this.state.location} onChange={this.handleChange} />
                    <br />
                    <div className="editor-style" >
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor-style2"
                            onEditorStateChange={this.onEditorStateChange}
                            toolbar={{
                                image: {
                                    uploadCallback: this.uploadImageCallBack,
                                    alt: { present: true, mandatory: false },
                                    previewImage: true,
                                },
                            }}
                        />
                    </div>
                    <button className='saveData'>
                        Modifier
                    </button>
                </form>}
            </div>
        );
    }
    
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({editProject}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(ExistingProjectModal);
