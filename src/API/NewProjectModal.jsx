import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import './../css/form.css';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

import {Form, Select} from 'react-form';

export default class NewProjectModal extends Component{

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool,
        children: PropTypes.node,
        id: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            category: '',
            categories: [],
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchAvailableCategories();
    }

    fetchAvailableCategories(){
        API.get('CATEGORIESCRUD','/CATEGORIES')
        .then(data => {
            console.log(data);
            this.setState({
                categories: data
            });
        })
        .catch ( err => console.log(err))
    }

    handleChange(event) {
        this.setState({[ target.name]: event.target.value});
    }

    handleSubmit(event) {
        const target = event.target;
          this.setState({
            [ target.name]: target.value
          });
    }

    render() {
        if(!this.props.show) {
            return null;
        }
    
        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            width:'100%',
            height: '100%',
            padding: 50,
        };

        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 600,
            minHeight: 150,
            margin: '0 auto',
            padding: 20
        };

        const closeButtonStyle = {
            marginTop : '15px',
            marginRight: '15px'
        };

        const categories = [
            {
                label: 'category1',
                value: 'category1',
            },
            {
                label: 'category2',
                value: 'category2',
            },
            {
                label: "category3",
                value: 'category3',
            },
        ]

        return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <div style ={{marginBottom:15}}> Création d'un nouveau projet </div>
                <Form> 
                    {formApi => (
                    <form onSubmit={formApi.submitForm} if="form1" className="project">
                        <label htmlFor="name">Nom <span className="required">*</span></label>
                        <input id ="name" rows="1" field="name" type="text" value={this.state.name} onChange={this.handleChange} />
                        <br />
                        <label htlmFor="category">Categorie</label>
                        <Select field="category" id="category" options={categories}/>
                        <br/>
                        <label htmlFor="cover" >Image de présentation<span className="required">*</span></label>
                        <input id="cover" field="cover" type="file"/>
                        <br />
                        <label htmlFor="startDate">Date de lancement<span class="required">*</span></label>
                        <DayPickerInput id="startDate" field="startDate"  />
                        <br />
                        <label htmlFor="description">Description<span className="required">*</span></label>
                        <Editor editorState={this.state.editorState} onChange={this.onChange} />
                    </form>
                    )}
                </Form>
                <div className="footer">
                    <Button.Group>
                        <Button positive style={closeButtonStyle} onClick={this.closeModal}>
                            Créer
                        </Button>
                        <Button style={closeButtonStyle} onClick={this.props.onClose}>
                            Annuler
                        </Button>
                    </Button.Group>
                </div>
            </div>
        </div>
        );
    }
}