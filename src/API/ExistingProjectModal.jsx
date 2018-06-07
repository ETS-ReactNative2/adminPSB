import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import {API} from 'aws-amplify';
import {Editor} from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';

export default class ExistingProjectModal extends Component {

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
            //cover: '',
            //pictures: [],
            //location: '',
            editorState: EditorState.createEmpty(),
        };
    }

    componentWillMount() {
        this.fetchProjectDetails();
    }

    fetchProjectDetails = async () => {
        API.get('PROJECTSCRUD','/PROJECTS/'+ this.props.selectedProjectId)
            .then(data => {
                const description = data[0].DESCRIPTION;
                const contentBlock = htmlToDraft(description);
                let editorState= EditorState.createEmpty();
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    editorState= EditorState.createWithContent(contentState);
                }
                this.setState({
                    category: data[0].CATEGORY,
                    name: data[0].NAME,
                    startDate: data[0].START_DATE,
                    endDate: data[0].END_DATE,
                    description: description,
                    editorState: editorState,
                    //cover:data[0].cover,
                    //pictures: data[0].pictures,
                    //location: data[0].location
                });
            })
            .catch((error) => {
                console.log(error);
            });
        
    }

    render() {
        const editorStyle ={
            borderStyle: 'none',
            width: '60%',
            minHeight: 200,
            margin: 50,
        }

        const titleStyle= {
            fontSize: '14px',
        }

        const {editorState} = this.state;
        return (
            <div style={editorStyle}>
                <div style={titleStyle}>{this.state.name}</div>
                <div>{this.state.category}</div>
                <div>{this.state.startDate}</div>
                <Editor
                    readOnly
                    toolbarHidden
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorStyle"
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        );
    }
    
}
