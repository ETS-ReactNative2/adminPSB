import React, { Component } from 'react';
import { Button, Table, Loader, Icon } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/general.css';
import NewProjectModal from './NewProjectModal';
import Modal from './Modal';
import ExistingProjectModal from './ExistingProjectModal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {deleteProject} from '../actions/index.js'

class Projects extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            newProjectOpen: false,
            existingProjectOpen: false,
            selectedProjectId: 0
        }
    }

    deleteProject = (projectToDeleteId) => {
        let myInit = { 
            headers: {} 
        }
        API.del('PROJECTSCRUD','/PROJECTS/object/'+projectToDeleteId,myInit )
        .then(data => {
            console.log(data);
            this.props.deleteProject(projectToDeleteId);
            this.setState({
                loading: false
            });
        })
        .catch ( err => console.log(err))
    }

    toggleNewProjectModal = () => {
        this.setState({
            newProjectOpen: !this.state.newProjectOpen
        });
    }

    toggleExistingProjectModal = () => {
        this.setState({
            existingProjectOpen: !this.state.existingProjectOpen
        });
    }

    displayExistingProject = (id) => {
        this.setState({
            existingProjectOpen: true,
            selectedProjectId: id
        });
    }

    render() {
        const projects = this.props.projects;
        const projectStyle = {
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline"
        }
        return (
            <CSSTransitionGroup
                transitionName="sample-app"
                transitionEnterTimeout={500}
                transitionAppearTimeout={500}
                transitionLeaveTimeout={300}
                transitionAppear={true}
                transitionEnter={true}
                transitionLeave={true}>
                <div className="content">
                    {this.state.loading &&  <Loader active inline='centered' />}
                    {!this.state.loading && (
                        <div>
                            <Button circular  icon='add' className="button" onClick={this.toggleNewProjectModal} />
                            <Modal show={this.state.newProjectOpen}
                                onClose={this.toggleNewProjectModal}
                                title="Création d'un nouveau projet">
                                <NewProjectModal onClose={this.toggleNewProjectModal}/>
                            </Modal>
                            <Modal show={this.state.existingProjectOpen}
                                onClose={this.toggleExistingProjectModal}
                                title="Description du projet">
                                <ExistingProjectModal 
                                    selectedProjectId={this.state.selectedProjectId}
                                />
                            </Modal>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Nom</Table.HeaderCell>
                                        <Table.HeaderCell>Categorie</Table.HeaderCell>
                                        <Table.HeaderCell>Debut</Table.HeaderCell>
                                        <Table.HeaderCell>Fin</Table.HeaderCell>
                                        <Table.HeaderCell>Lieu</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {projects.map((data) =>
                                        <Table.Row key={data.id}>
                                            <Table.Cell><span style={projectStyle} onClick={() => this.displayExistingProject(data.id)}>{data.name}</span></Table.Cell>
                                            <Table.Cell>{data.category}</Table.Cell>
                                            <Table.Cell>{data.startDate}</Table.Cell>
                                            <Table.Cell>{data.endDate}</Table.Cell>
                                            <Table.Cell>{data.location}</Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                <img src={require('../Images/closeIcon.png')} 
                                                style={{cursor: "pointer"}}
                                                onClick={() => {if(window.confirm("Tu veux vraiment supprimer ce projet ?")) this.deleteProject(data.id)}}
                                                width="16" 
                                                height="16" />
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
            </div>
            </CSSTransitionGroup>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({deleteProject}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Projects);
