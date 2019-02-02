import React, { Component } from 'react';
import { Button, Table, Loader, Icon } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {API} from 'aws-amplify';
import './../css/api.css';
import NewProjectModal from './NewProjectModal';
import Modal from './Modal';
import ExistingProjectModal from './ExistingProjectModal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {deleteProject} from '../actions/index.js';
import { ToastContainer, toast } from 'react-toastify';
import './../css/ReactToastify.css';

class Projects extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            newProjectOpen: false,
            existingProjectOpen: false,
            selectedProjectId: 0,
            column: null,
            direction: null,
            data: []
        }
    }

    componentDidMount() {
        const {projects} = this.props;
        this.setState({
            ...this.state,
            data: projects
        });
    }

    componentWillReceiveProps(nextProps) {
        const { projects } = nextProps;
        this.setState({
          ...this.state,
          data: projects
        });
    }

    //Sort the projects in the table
    handleSort = clickedColumn => () => {
        const { column, direction, data } = this.state;
        console.log(data);
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: this.sortBy(data, clickedColumn),
                direction: 'ascending',
            })
          return
        } 
    
        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        });
      }

    //Sort data
    sortBy = (data, column) => {
        return data.sort(function(a,b) {
            var x =a[column];
            var y=b[column];
            if(typeof x === 'undefined') return 1;
            if(typeof y === 'undefined') return -1;
            return x.localeCompare(y, 'fr', {sensitivity: 'base'});
        })
    }

    //Delete a project on server side
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
            toast.success(
                <div style ={{textAlign:'center'}}>
                    Suppression réussie.
                </div>
            );
        })
        .catch ( err => {
            console.log(err);
            toast.error(
                <div style ={{textAlign:'center'}}>
                    Erreur lors de la suppression.
                </div>
            );
        })
    }

    //Displays a feedback after creation of a project
    handleProjectCreation = (hasError) => {
        if(hasError){
            toast.error(
                <div style ={{textAlign:'center'}}>
                    Erreur lors de l'ajout.
                </div>
            );
        }else{
            toast.success(
                <div style ={{textAlign:'center'}}>
                    Projet ajouté.
                </div>
            );
        }
    }

    //Displays a feedback after edition of a project
    handleProjectEdition = (hasError) => {
        if(hasError){
            toast.error(
                <div style ={{textAlign:'center'}}>
                    Erreur lors de la mise à jour.
                </div>
            );
        }else{
            toast.success(
                <div style ={{textAlign:'center'}}>
                    Projet mis à jour.
                </div>
            );
        }
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
        const { column, direction, data } = this.state;
        const projects = this.props.projects;
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
                            <Button circular  
                                icon='add' 
                                className="button" 
                                onClick={this.toggleNewProjectModal} 
                            />
                            <Modal 
                                show={this.state.newProjectOpen}
                                onClose={this.toggleNewProjectModal}
                                title="Création d'un nouveau projet">
                                <NewProjectModal 
                                    onClose={this.toggleNewProjectModal}
                                    hasError={this.handleProjectCreation}
                                    data={this.state.data}
                                />
                            </Modal>
                            <Modal 
                                show={this.state.existingProjectOpen}
                                onClose={this.toggleExistingProjectModal}
                                title="Description du projet">
                                <ExistingProjectModal 
                                    selectedProjectId={this.state.selectedProjectId}
                                    hasError={this.handleProjectEdition}
                                    data={this.state.data}
                                />
                            </Modal>
                            <Table sortable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell
                                            sorted={column=="name"? direction:null}
                                            onClick={this.handleSort('name')}>
                                            Nom
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column=="category"? direction:null}
                                            onClick={this.handleSort('category')}>
                                            Categorie
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column=="startDate"? direction:null}
                                            onClick={this.handleSort('startDate')}>
                                            Debut
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column=="endDate"? direction:null}
                                            onClick={this.handleSort('endDate')}>
                                            Fin
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column=="location"? direction:null}
                                            onClick={this.handleSort('location')}>
                                            Lieu
                                        </Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {data.map((project) =>
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
                                                <img src={require('../Images/closeIcon.png')} 
                                                className="linked-img"
                                                onClick={() => {if(window.confirm("Tu veux vraiment supprimer ce projet ?")) this.deleteProject(project.id)}}
                                                width="16" 
                                                height="16" />
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                            <ToastContainer 
                                position="bottom-center"
                                autoClose={5000}
                                hideProgressBar
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnVisibilityChange={false}
                                draggable={false}
                                pauseOnHover={false}
                            />
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
