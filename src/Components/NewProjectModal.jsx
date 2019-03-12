import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './../css/api.css';
import ReactDOM from 'react-dom';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw} from 'draft-js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {addProject} from '../actions/index.js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {hasNoDuplicateForColumnName} from '../API/generalApi';
import {postFile, getSignedUrlToPostFile, postProject} from '../API/fetchApi';
import {FormattedMessage, defineMessages} from 'react-intl';

const PREFIX = 'https://s3-eu-west-2.amazonaws.com/psb-users/';

class NewProjectModal extends Component{

    static propTypes = {
        displayNotification: PropTypes.func,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            isLoading: false,
            description: '',
            startDate: '',
            location: '',
            category: this.props.categories[0].name,
            coverImage: '',
            editorState: EditorState.createEmpty(),
        };
    }

    //Post new project to server
    handleSubmit = (event) => {
        event.preventDefault();
        const id= Date.now();
        const {startDate, coverImage, category, location, name} = this.state;
        const messages = defineMessages({
            successMessage: {
              id: "Projects.projectAddedWithSuccess",
              defaultMessage: "Projet ajouté.",
            },
            errorMessage: {
                id: "Projects.errorWhileAddingProject",
                defaultMessage: "Erreur lors de l'ajout.",
              },
          });
        if(this.hasNoDuplicate(name)){
            const description = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
            postProject(id,name, description, startDate, category, coverImage, location)
            .then(data => {
                console.log(data);
                this.props.addProject(id,name,description,startDate, coverImage, category, null, location);
                this.props.displayNotification("success",messages.successMessage);
            })
            .catch((error) => {
                console.log(error);
                this.props.displayNotification("error",messages.errorMessage);
            });
            this.props.onClose();
        }
    };

    //Check if there is a project with the name chosen by the user already exist
    hasNoDuplicate = (projectName) => {
        let {projects} = this.props;
        const result = hasNoDuplicateForColumnName(projectName, projects);
        const messages = defineMessages({
            infoMessage: {
              id: "Projects.duplicateProject",
              defaultMessage: "Un projet avec ce nom existe déjà.",
            },
          });
        if(!result){
            this.props.displayNotification("info",messages.infoMessage);
        }
        return result;
    }

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

    //Validate the form
    validate(name, startDate, category, location){
        return {
            name: name.length ===0,
            startDate: startDate.length ===0,
            category: category.length ===0,
            location: location.length ===0
        }
    }

    //Post a file to server side and update file name to project coverImage field
    handleFile= (event) => {
        const file = event.target.files[0];
        const messages = defineMessages({
            errorMessage: {
              id: "Projects.errorWhileUpdatingPicture",
              defaultMessage: "Erreur lors de l'ajout de la photo.",
            },
          });
        let currentComponent = this;
        getSignedUrlToPostFile(file)
        .then(function (result) {
            var signedUrl = result.data.signedUrl;
            return postFile(file, signedUrl);
        })
        .then(function (result) {
            console.log(result);
            if(result.status == 200){
                currentComponent.setState({
                    coverImage: PREFIX+file.name,
                });
            }
        })
        .catch(function (err) {
            currentComponent.props.displayNotification("error",messages.errorMessage);
            console.log(err);
        });
    }

    //Put a new file to server side
    uploadImageCallBack(file) {
        getSignedUrlToPostFile(file)
        .then(function (result) {
            var signedUrl = result.data.signedUrl;
            return postFile(file, signedUrl);
        })
        .then(response => {
            return {
                data: {
                    link: PREFIX+file.name
                }
            }
        })
        .catch(function (err) {
            console.log(err);
            throw err;
        });
    }

    render() {
        const editorStyle ={
            borderStyle: 'solid',
            borderRadius: '4px',
            borderWidth: '1px',
            borderColor: '#ccc',
            width: '100%',
            minHeight: 200
        }
        const {name, description, startDate, category, editorState, coverImage, location} = this.state;
        const errors = this.validate(name, startDate, category, location);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        return (
            <form onSubmit={this.handleSubmit}> 
                <label>
                    <FormattedMessage
                        id="Projects.newName"
                        defaultMessage="Nom"
                    />
                    <span className='required'>*</span>
                </label>
                <input autoFocus 
                    name="name" 
                    rows="1" 
                    type="text" 
                    className={errors.name?"error":""} 
                    value={name} 
                    onChange={this.handleChange}
                />
                <br />
                <label>
                    <FormattedMessage
                        id="Projects.newCategory"
                        defaultMessage="Catégorie"
                    />
                </label>
                <select 
                    name="category" 
                    className={errors.category?"error":""} 
                    value={category} 
                    onChange={this.handleChange}>
                        {this.props.categories.map(item => (
                            <option key={item.name} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                </select>
                <br/>
                <label>
                    <FormattedMessage
                        id="Projects.newPicture"
                        defaultMessage="Image de présentation"
                    />
                    <span className="required">*</span>
                </label>
                <input 
                    name="cover" 
                    type="file" 
                    onChange={this.handleFile}
                />
                {coverImage!=''?
                    <div >
                        <img className="imgPreview" src={coverImage}/>
                    </div>
                    : null
                }
                <br />
                <label>
                    <FormattedMessage
                        id="Projects.newStart"
                        defaultMessage="Date de lancement"
                    />
                    <span className="required">*</span>
                </label>
                <input 
                    name="startDate" 
                    style={{width: 150}} 
                    row="1" 
                    className={errors.startDate?"error":""} 
                    type="date" 
                    value={startDate} 
                    onChange={this.handleChange} />
                <br />
                <label>
                    <FormattedMessage
                        id="Projects.newLocation"
                        defaultMessage="Lieu"
                    />
                    <span className="required">*</span>
                </label>
                <input 
                    name="location" 
                    row="1" 
                    className={errors.location?"error":""} t
                    type="text" 
                    value={location} 
                    onChange={this.handleChange} />
                <br />
                <div className="editor-style">
                    <Editor
                        editorState={editorState}
                        style={{height:"25%"}}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor-style2"
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            image: {
                                uploadCallback: this.uploadImageCallBack,
                                alt: { present: true, mandatory: false },
                                previewImage: true
                            },
                        }}
                    />
                </div>
                <button className='saveData' disabled={!isEnabled}>
                    <FormattedMessage
                        id="Projects.create"
                        defaultMessage="Créer"
                    />
                </button>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        projects: state.projects
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addProject}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(NewProjectModal);
