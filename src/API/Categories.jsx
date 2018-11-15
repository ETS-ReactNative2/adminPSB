import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/general.css';
import CategoryModal from './CategoryModal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {deleteCategory} from '../actions/index.js'

class Categories extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpen: false,
            column: null,
            direction: null
        };
    }

    toggleModal = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }


    deleteCategory = (categoryToDeleteName) => {
        let myInit = { 
            headers: {} 
        }
        API.del('CATEGORIESCRUD','/CATEGORIES/object/'+categoryToDeleteName,myInit )
        .then(data => {
            console.log(data);
            this.props.deleteCategory(categoryToDeleteName);
            this.setState({
                loading: false
            });
        })
        .catch ( err => console.log(err))
    }

    handleSort = clickedColumn => () => {
        {/*const { column, categories, direction } = this.state;
    
       } if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            categories: _.sortBy(categories, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        } 
    
        this.setState({
            categories: categories.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })*/}
      }


    render() {
        const { column, direction } = this.state;
        const categories = this.props.categories;
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
                        <Button circular  icon='add' className="button" onClick={this.toggleModal} />
                        <CategoryModal show={this.state.isOpen}
                            onClose={this.toggleModal}>
                            
                        </CategoryModal>
                        <Table sortable selectable>
                            <Table.Header className="categoriesHeader">
                                <Table.Row>
                                    <Table.HeaderCell
                                    sorted={column === 'categories' ? direction : null}
                                    onClick={this.handleSort('categories')}
                                    >
                                        Catégories 
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={2} ></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {categories.map((data) =>
                                    <Table.Row key={data.name}>
                                        <Table.Cell>{data.name}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                                <img src={require('../Images/closeIcon.png')} 
                                                style={{cursor: "pointer"}}
                                                onClick={() => {if(window.confirm("Tu veux vraiment supprimer cette catégorie ?")) this.deleteCategory(data.name)}}
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
        categories: state.categories
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({deleteCategory}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories);