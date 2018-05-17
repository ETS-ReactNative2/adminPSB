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
        description: ''
        //cover: '',
        //pictures: [],
        //location: ''
    }

    componentWillMount() {
        this.fetchProjectDetails();
    }

    fetchProjectDetails = async () => {
        API.get('PROJECTSCRUD','/PROJECTS/'+ this.props.match.params.id)
            .then(data => {
                console.log(data);
                this.setState({
                    id: data[0].ID,
                    category: data[0].CATEGORY,
                    name: data[0].NAME,
                    startDate: data[0].START_DATE,
                    endDate: data[0].END_DATE,
                    description: data[0].DESCRIPTION,
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
        return (
            <div className="content-text">
                <div>Projet {this.state.name}</div>
                <div> {this.state.description} </div>
            </div>
        );
    }
    
}
