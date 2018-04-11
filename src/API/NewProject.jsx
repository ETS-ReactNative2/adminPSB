import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/general.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
//import 'react-day-picker/lib/style.css';

export default class NewProject extends Component{

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            category: '',
            categories: []
        };

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
        let categories = this.state.categories;
        return (
            <div> 
                 <form onSubmit={this.handleSubmit}>
                    <label>
                        Nom:
                        <input name ="name" type="text" value={this.state.name} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Image de présentation:
                    <input type="file"/>
                    </label>
                    <br />
                    <label>
                        Date de lancement:
                        <DayPickerInput onDayChange={day => console.log(day)} />
                    </label>
                    <label>
                        Description:
                        <textarea name="description" value={this.state.description} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}