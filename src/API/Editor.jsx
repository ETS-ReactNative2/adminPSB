import React, { Component } from 'react';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/form.css';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';


export default class NewProjectModal extends Component{

    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
    }

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if(newState){
            this.onChange(newState);
            return 'handled'
        }
        return 'not-handled'
    }

    onUnderlineClick(){
        this.onChange(RichUtils.onUnderlineClick(this.state.editorState));
    }

    render() {
        return (
            <div>
                <button onClick={this.onUn}>Souligner</button>
                <Editor 
                    editorState={this.state.editorState} 
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange} 
                />
            </div>
        );
    }
}