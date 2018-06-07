import React, { Component } from 'react';
import { Button, Table, Loader, Icon } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/general.css';
import NewProjectModal from './NewProjectModal';
import Modal from './Modal';
import ExistingProjectModal from './ExistingProjectModal';

export default class Projects extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            newProjectOpen: false,
            existingProjectOpen: false,
            selectedProjectId: 0
        }
        this.displayExistingProject = this.displayExistingProject.bind(this);
    }

    componentDidMount() {
        this.fetchProjects();
    }

    fetchProjects = async () => {
        this.setState(() => {
            return {
                loading: true
            }
        });

        API.get('PROJECTSCRUD','/PROJECTS')
            .then(data => {
                console.log(data);
                this.setState({
                    data: data,
                    loading: false
                });
            })
            .catch ( err => console.log(err))
    }

    toggleNewProjectModal = () => {
        if(this.state.newProjectOpen){
            this.fetchProjects();
        }
        this.setState({
            newProjectOpen: !this.state.newProjectOpen
        });
    }

    toggleExistingProjectModal = () => {
        if(this.state.existingProjectOpen){
            this.fetchProjects();
        }
        this.setState({
            existingProjectOpen: !this.state.existingProjectOpen
        });
    }

    displayExistingProject(id){
        this.setState({
            existingProjectOpen: true,
            selectedProjectId: id
        });
    }

    render() {

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
                                <NewProjectModal />
                            </Modal>
                            <Modal show={this.state.existingProjectOpen}
                                onClose={this.toggleExistingProjectModal}
                                title="Projet">
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
                                    {this.state.data.map((data) =>
                                        <Table.Row key={data.ID}>
                                            <Table.Cell><span style={projectStyle} onClick={() => this.displayExistingProject(data.ID)}>{data.NAME}</span></Table.Cell>
                                            <Table.Cell>{data.CATEGORY}</Table.Cell>
                                            <Table.Cell>{data.START_DATE}</Table.Cell>
                                            <Table.Cell>{data.END_DATE}</Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
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
