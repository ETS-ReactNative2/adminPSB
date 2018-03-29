import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';

export default class Project extends Component {

    props ={
        id: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
    }

    state = {
        id: '',
        category: '',
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        //cover: '',
        //pictures: [],
        //localisation: ''
    }

    componentWillMount() {
        this.fetchProjectDetails();
    }

    fetchProjectDetails() {
        API.get('PROJECTSCRUD','/PROJECTS'+ this.props.id)
            .then(data => {
                console.log(data);
                this.setState({
                    id: data.id,
                    category: data.category,
                    name: data.name,
                    //startDate: data.startDate,
                    //endDate: data.endDate,
                    description: data.description,
                    //cover:data.cover,
                    //pictures: data.pictures,
                    //localisation: data.localisation
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div>Projet {this.state.name}</div>
        );
    }
    
}
