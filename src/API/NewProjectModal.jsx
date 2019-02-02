import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './../css/api.css';
import ReactDOM from 'react-dom';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw} from 'draft-js';
import axios from 'axios';
import {API} from 'aws-amplify';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {addProject} from '../actions/index.js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { toast } from 'react-toastify';

const PREFIX = 'https://s3-eu-west-2.amazonaws.com/psb-users/';

class NewProjectModal extends Component{


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

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        hasError: PropTypes.func.isRequired
    }

    //Post new project to server
    handleSubmit = (event) => {
        event.preventDefault();
        const id= Date.now();
        const name = this.state.name;
        if(this.hasNoDuplicate(name)){
            const description = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
            const startDate = this.state.startDate;
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
                    'CATEGORY': category,
                    'COVER_IMG': coverImage,
                    'LOCATION' : location
                }
            }
            API.post('PROJECTSCRUD','/PROJECTS', requestParams)
            .then(data => {
                console.log(data);
                this.props.addProject(id,name,description,startDate, coverImage, category, null, location);
                this.props.hasError(false);
            })
            .catch((error) => {
                console.log(error);
                this.props.hasError(true);
            });
            this.props.onClose();
        }
    };

    //Check if there is a project with the name chosen by the user already exist
    hasNoDuplicate = (projectName) => {
        let result = true;
        this.props.data.map((project) => {
            if(project.name === projectName){
                toast.info(
                    <div style ={{textAlign:'center'}}>
                        Un projet avec ce nom existe déjà
                    </div>
                );
                result = false;
            }
        })
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
        let currentComponent = this;
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body: {
                'filename': file.name,
                'filetype': file.type
            }
        };
        API.post('UPLOAD','/getSignedUrl', requestParams)
        .then(function (result) {
            var signedUrl = result.data.signedUrl;
            
            var options = {
                headers: {
                    'Content-Type': file.type
                }
            };
    
            return axios.put(signedUrl, file, options);
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
            console.log(err);
        });
    }

    //Upload from server a file
    uploadImageCallBack(file) {
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body: {
                'filename': file.name,
                'filetype': file.type
            }
        };
        return API.post('UPLOAD','/getSignedUrl', requestParams)
        .then(function (result) {
            var signedUrl = result.data.signedUrl;
            
            var options = {
                headers: {
                    'Content-Type': file.type
                }
            };
    
            return axios.put(signedUrl, file, options);
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

        const {editorState} = this.state;
        const {name, description, startDate, category} = this.state;
        const errors = this.validate(name, startDate, category, location);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);

        return (
            <form onSubmit={this.handleSubmit}> 
                <label>
                    Nom 
                    <span className='required'>*</span>
                </label>
                <input autoFocus 
                    name="name" 
                    rows="1" 
                    type="text" 
                    className={errors.name?"error":""} 
                    value={this.state.name} 
                    onChange={this.handleChange}
                />
                <br />
                <label>Catégorie</label>
                <select 
                    name="category" 
                    className={errors.category?"error":""} 
                    value={this.state.category} 
                    onChange={this.handleChange}>
                        {this.props.categories.map(item => (
                            <option key={item.name} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                </select>
                <br/>
                <label>Image de présentation
                    <span className="required">*</span>
                </label>
                <input 
                    name="cover" 
                    type="file" 
                    onChange={this.handleFile}
                />
                {this.state.coverImage!=''?
                    <div >
                        <img className="imgPreview" src={this.state.coverImage}/>
                    </div>
                    : null
                }
                <br />
                <label>Date de lancement
                    <span className="required">*</span>
                </label>
                <input 
                    name="startDate" 
                    style={{width: 150}} 
                    row="1" 
                    className={errors.startDate?"error":""} 
                    type="date" value={this.state.startDate} 
                    onChange={this.handleChange} />
                <br />
                <label>Lieu
                    <span className="required">*</span>
                </label>
                <input 
                    name="location" 
                    row="1" 
                    className={errors.location?"error":""} t
                    type="text" 
                    value={this.state.location} 
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
                    Créer
                </button>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addProject}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(NewProjectModal);
