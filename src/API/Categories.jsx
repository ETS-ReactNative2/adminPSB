import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {API} from 'aws-amplify';
import './../css/api.css';
import CategoryModal from './CategoryModal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {deleteCategory} from '../actions/index.js';
import { ToastContainer, toast } from 'react-toastify';
import './../css/ReactToastify.css';

class Categories extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isOpen: false,
            column: null,
            direction: null,
            data: []
        };
    }

    componentDidMount() {
        const {categories} = this.props;
        this.setState({
            ...this.state,
            data: categories
        });
    }

    //Open/Close the modal to add a new category
    toggleModal = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }

    componentWillReceiveProps(nextProps) {
        const { categories } = nextProps;
        this.setState({
          ...this.state,
          data: categories
        });
    }

    //Delete a category on server side
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
            toast.success(
                <div style ={{textAlign:'center'}}>
                    Suppression réussie.
                </div>
            );
        })
        .catch ( 
            err => {
                console.log(err);
                toast.error(
                    <div style ={{textAlign:'center'}}>
                        Erreur lors de la suppression.
                    </div>
                );
            })
    }

    //Sort the categories in the table
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

    //Displays a feedback after creation of a category
    handleCategoryCreation = (hasError) => {
        if(hasError){
            toast.error(
                <div style ={{textAlign:'center'}}>
                    Erreur lors de l'ajout.
                </div>
            );
        }else{
            toast.success(
                <div style ={{textAlign:'center'}}>
                    Catégorie ajoutée.
                </div>
            );
        }
    }


    render() {
        const { column, direction, data } = this.state;
        const categories = this.state.data;
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
                            onClose={this.toggleModal}
                            hasError={this.handleCategoryCreation}
                            data={this.state.data}
                        >
                        </CategoryModal>
                        <Table sortable selectable>
                            <Table.Header className="categoriesHeader">
                                <Table.Row>
                                    <Table.HeaderCell
                                    sorted={column === 'name' ? direction : null}
                                    onClick={this.handleSort('name')}
                                    >
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
        categories: state.categories
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({deleteCategory}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories);