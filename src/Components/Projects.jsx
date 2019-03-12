import React, { Component } from 'react';
import { Button, Table, Loader, Icon } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import './../css/api.css';
import NewProjectModal from './NewProjectModal';
import Modal from './Modal';
import ExistingProjectModal from './ExistingProjectModal';
import {sortDataInTable} from "../API/tableApi";
import {delProject}  from "../API/fetchApi";
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {deleteProject} from '../actions/index.js';
import * as Constants from '../Globals/Constants';
import {FormattedMessage, defineMessages} from 'react-intl';

class Projects extends Component{

    static propTypes = {
        displayNotification: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            newProjectOpen: false,
            existingProjectOpen: false,
            selectedProjectId: 0,
            column: null,
            direction: null
        }
    }

    //Sort the projects in the table
    handleSort = clickedColumn => () => {
        let {projects} = this.props;
        let direction = this.state.direction;
        sortDataInTable(clickedColumn,this.state.column, direction, projects);
        this.setState({
            column: clickedColumn,
            direction: direction
        });
    }

    //Delete a project on server side
    deleteProject = (projectToDeleteId) => {
        const messages = defineMessages({
            successMessage: {
              id: "Projects.projectDeletedWithSuccess",
              defaultMessage: "Suppression réussie.",
            },
            errorMessage: {
                id: "Projects.errorWhileDeletingProject",
                defaultMessage: "Erreur lors de la suppression.",
              },
          });
        delProject(projectToDeleteId)
        .then(data => {
            console.log(data);
            this.props.deleteProject(projectToDeleteId);
            this.props.displayNotification(true,messages.successMessage);
        })
        .catch ( err => {
            console.log(err);
            this.props.displayNotification(false,messages.errorMessage);
        })
    }

    //Open/Close modal for new project creation
    toggleNewProjectModal = () => {
        this.setState({
            newProjectOpen: !this.state.newProjectOpen
        });
    }

    //Open/Close modal for existing project edition
    toggleExistingProjectModal = () => {
        this.setState({
            existingProjectOpen: !this.state.existingProjectOpen
        });
    }

    //Open modal to display content of an existing project
    displayExistingProject = (id) => {
        this.setState({
            existingProjectOpen: true,
            selectedProjectId: id
        });
    }

    render() {
        const { column, direction, selectedProjectId} = this.state;
        const {projects} = this.props;
        const messages = defineMessages({
            projectDescriptionMessage: {
              id: "Projects.projectDescription",
              defaultMessage: "Description du projet"
            },
            deleteProjectMessage: {
                id: "Projects.deleteProjectConfirmation",
                defaultMessage: "Tu veux vraiment supprimer ce projet ?",
              },
              newProjectTitleMessage: {
                id: "Projects.newProjectTitle",
                defaultMessage: "Création d'un nouveau projet",
              },
          });
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
                    <div>
                        <Button circular  
                            icon='add' 
                            className="button" 
                            onClick={this.toggleNewProjectModal} 
                        />
                        <Modal 
                            show={this.state.newProjectOpen}
                            onClose={this.toggleNewProjectModal}
                            title={<FormattedMessage id="Projects.newProjectTitle" defaultMessage="Création d'un nouveau projet" />}>
                            <NewProjectModal 
                                onClose={this.toggleNewProjectModal}
                                displayNotification={this.props.displayNotification}
                            />
                        </Modal>
                        <Modal 
                            show={this.state.existingProjectOpen}
                            onClose={this.toggleExistingProjectModal}
                            title={<FormattedMessage id="Projects.projectDescription" defaultMessage="Description du projet" />}>
                            <ExistingProjectModal 
                                selectedProjectId={selectedProjectId}
                                displayNotification={this.props.displayNotification}
                            />
                        </Modal>
                        <Table sortable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={column=="name"? direction:null}
                                        onClick={this.handleSort('name')}>
                                        <FormattedMessage
                                            id="Projects.name"
                                            defaultMessage="Nom"
                                        />
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column=="category"? direction:null}
                                        onClick={this.handleSort('category')}>
                                        <FormattedMessage
                                            id="Projects.category"
                                            defaultMessage="Categorie"
                                        />
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column=="startDate"? direction:null}
                                        onClick={this.handleSort('startDate')}>
                                        <FormattedMessage
                                            id="Projects.start"
                                            defaultMessage="Début"
                                        />
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column=="endDate"? direction:null}
                                        onClick={this.handleSort('endDate')}>
                                        <FormattedMessage
                                            id="Projects.end"
                                            defaultMessage="Fin"
                                        />
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column=="location"? direction:null}
                                        onClick={this.handleSort('location')}>
                                        <FormattedMessage
                                            id="Projects.location"
                                            defaultMessage="Lieu"
                                        />
                                    </Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {projects.map((project) =>
                                    <Table.Row key={project.id}>
                                        <Table.Cell>
                                            <span 
                                                className="linked-text"
                                                onClick={() => this.displayExistingProject(project.id)}>
                                                    {project.name}
                                            </span></Table.Cell>
                                        <Table.Cell>{project.category}</Table.Cell>
                                        <Table.Cell>{project.startDate}</Table.Cell>
                                        <Table.Cell>{project.endDate}</Table.Cell>
                                        <Table.Cell>{project.location}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <img src={Constants.CLOSE_ICON_PATH} 
                                            className="linked-img"
                                            onClick={() => {if(window.confirm(messages.deleteProjectMessage)) this.deleteProject(project.id)}}
                                            width="16" 
                                            height="16" />
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
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
