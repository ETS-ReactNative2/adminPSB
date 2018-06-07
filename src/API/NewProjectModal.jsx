import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/form.css';
import './../css/editor.css';
import ReactDOM from 'react-dom';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw} from 'draft-js';

export default class NewProjectModal extends Component{


    constructor(props) {
        super(props);
        this.state = {
            displayError: false,
            name: '',
            description: '',
            startDate: '',
            category: '',
            categories: [],
            editorState: EditorState.createEmpty(),
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchAvailableCategories();
    }

    handleSubmit(event) {
        event.preventDefault();
        if(!event.target.checkValidity()){
            this.setState({displayError:true});
            return;
        }
        this.setState({displayError:false});
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'ID': Date.now(),
                'NAME': this.state.name,
                'DESCRIPTION': draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
                'START_DATE': this.state.startDate,
                'CATEGORY': this.state.category
            }
        }
        API.post('PROJECTSCRUD','/PROJECTS', requestParams)
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
        this.props.onClose();
    };

    fetchAvailableCategories(){
        API.get('CATEGORIESCRUD','/CATEGORIES')
        .then(data => {
            let newCategories = [{label: '',value: ''}];
            data.map((item) => {
                const c ={
                    label: item.NAME,
                    value: item.NAME
                }
                newCategories.push(c);
            });
            this.setState({categories: newCategories});
        })
        .catch ( err => console.log(err))
    }

    handleChange(event) {
        const target = event.target;
        if(target){
            this.setState({
            [ target.name]: target.value
            });
        }
    }

    onEditorStateChange(editorState) {
        this.setState({
          editorState,
        });
      };

    handleFile(event){
        const reader = new FileReader();
        const file = event.target.files[0];
    
        reader.onload = (upload) => {
          this.setState({
            data_uri: upload.target.result,
            filename: file.name,
            filetype: file.type
          });
        };
    
        reader.readAsDataURL(file);
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

        const {displayErrors} = this.state;
        const {editorState} = this.state;

        return (
            <form onSubmit={this.handleSubmit} 
            className={displayErrors ? 'displayErrors' : ''} 
            noValidate> 
                <label>Nom <span className='required'>*</span></label>
                <input name="name" rows="1" type="text" value={this.state.name} onChange={this.handleChange} required/>
                <br />
                <label>Catégorie</label>
                <select name="category" value={this.state.category} onChange={this.handleChange}>
                    {this.state.categories.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br/>
                <label>Image de présentation<span className="required">*</span></label>
                <input name="cover" type="file" 
                    onChange={this.handleFile}/>
                <br />
                <label>Date de lancement<span className="required">*</span></label>
                <input name="startDate" row="1" type="date" value={this.state.startDate} onChange={this.handleChange} />
                <br />
                <div style={editorStyle}>
                    <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorStyle"
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            uploadCallback: uploadImageCallBack,
                            alt: { present: true, mandatory: false },
                        }}
                    />
                </div>
                <button className='saveData' >
                    Créer
                </button>
            </form>
        );
    }
}

function uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader(); // eslint-disable-line no-undef
        reader.onload = e => resolve({ data: { link: e.target.result } });
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
      });
  }