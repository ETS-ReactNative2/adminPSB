import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import {API} from 'aws-amplify';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {editProject} from '../actions/index.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class ExistingProjectModal extends Component {

    static propTypes = {
        selectedProjectId: PropTypes.number.isRequired,
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

    handleSubmit = (event) => {
        event.preventDefault();
        const id = this.props.selectedProjectId;
        const name = this.state.name;
        const description = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const coverImage = this.state.coverImage;
        const category = this.state.category;
        const location = this.state.location;
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'ID': id,
                'NAME': name,
                'DESCRIPTION': description,
                'START_DATE': startDate,
                'END_DATE': endDate,
                'CATEGORY': category,
                'COVER_IMG': coverImage,
                'LOCATION' : location
            }
        }
        API.post('PROJECTSCRUD','/PROJECTS', requestParams)
        .then(data => {
            console.log(data);
            this.props.editProject(id,name,description,startDate, coverImage, category, endDate, location);
        })
        .catch((error) => {
            console.log(error);
        });
        this.switchEditMode();
    };

    handleChange = (event) => {
        const target = event.target;
        if(target){
            this.setState({
            [ target.name]: target.value
            });
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
    };

    switchEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
          });
    }

    render() {
        const editorStyle ={
            borderStyle: 'none',
            width: '80%',
            minHeight: 200,
            margin: 50,
        }

        const {editorState} = this.state;
        return (
            <div >
                <div
                style = {{display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
                    <div>
                        <button>
                            <img className="imgPreview" src={this.state.coverImage}/>
                        </button>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', marginLeft: 40}}>
                        <img src={require('../Images/editIcon.png')} 
                            onClick={() => {this.switchEditMode();}}
                            style={{float:"right", cursor: 'pointer',}}
                            width="20" 
                            height="20" 
                        />
                        <div style={{marginLeft: 20}}>
                            <div style={{fontSize: '16px'}}> {this.state.name} </div>
                            <div>{this.state.category}</div>
                            <div>{this.state.startDate}</div>
                            { !this.state.editMode && <div>{this.state.location}</div>}
                        </div>
                    </div>
                </div>
                { !this.state.editMode &&<Editor
                    readOnly
                    toolbarHidden
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorStyle"
                    onEditorStateChange={this.onEditorStateChange}
                />}
                { this.state.editMode && <form onSubmit={this.handleSubmit}> 
                    <br />
                    <label>Date de fin</label>
                    <input name="endDate" style={{width: 150}} row="1"  type="date" value={this.state.endDate} onChange={this.handleChange} />
                    <br />
                    <label>Lieu<span className="required">*</span></label>
                    <input name="location" row="1" type="text" value={this.state.location} onChange={this.handleChange} />
                    <br />
                    <div style={editorStyle} >
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorStyle"
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
