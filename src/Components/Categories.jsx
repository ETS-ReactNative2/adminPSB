import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {delCategory}  from "../API/fetchApi";
import {sortDataInTable} from "../API/tableApi";
import './../css/api.css';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import CategoryModal from './CategoryModal';
import {deleteCategory} from '../actions/index.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Categories extends Component {

    static propTypes = {
        displayNotification: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            column: null,
            direction: null
        };
    }
    
    //Delete a category on server side
    deleteCategory = (categoryToDeleteName) => {
        let {categories} = this.props;
        delCategory(categoryToDeleteName)
        .then(data => {
            console.log(data);
            this.props.deleteCategory(categoryToDeleteName);
            this.props.displayNotification("success","Suppression réussie.");
        })
        .catch ( 
            err => {
                console.log(err);
                this.props.displayNotification("error","Erreur lors de la suppression.");
            })
    }

    //Sort the categories in the table
    handleSort = clickedColumn => () => {
        let {categories} = this.props;
        let direction = this.state.direction;
        sortDataInTable(clickedColumn,this.state.column, direction, categories);
        this.setState({
            column: clickedColumn,
            direction: direction
        });
    }

    //Open/Close the modal to add a new category
    toggleModal = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }
    
    render(){
        const {categories} = this.props;
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
                        <Button circular  icon='add' className="button" onClick={this.toggleModal} />
                        <CategoryModal show={this.state.isOpen}
                            onClose={this.toggleModal}
                            displayNotification={this.props.displayNotification}
                        >
                        </CategoryModal>
                        <Table sortable selectable>
                            <Table.Header className="categoriesHeader">
                                <Table.Row>
                                    <Table.HeaderCell
                                    sorted={this.state.column === 'name' ? this.state.direction : null}
                                    onClick={this.handleSort('name')}>
                                        Catégories 
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={2} ></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {categories.map((categorie) =>
                                    <Table.Row key={categorie.name}>
                                        <Table.Cell>{categorie.name}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                                <img src={require('../Images/closeIcon.png')} 
                                                className="linked-img"
                                                onClick={() => {if(window.confirm("Tu veux vraiment supprimer cette catégorie ?")) this.deleteCategory(categorie.name)}}
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
        categories: state.categories
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({deleteCategory}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories);

