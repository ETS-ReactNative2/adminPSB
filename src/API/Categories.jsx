import React, { Component } from 'react';
import { Button, Table, Loader } from 'semantic-ui-react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link} from 'react-router-dom';
import awsmobile from './../aws-exports';
import {API} from 'aws-amplify';
import PropTypes from 'prop-types';
import './../css/general.css';
import CategoryModal from './CategoryModal';

export default class Categories extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            isOpen: false
        };
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen){
            this.fetchCategories();
        }
        this.setState({
          isOpen: !this.state.isOpen
        });
      }

    componentDidMount() {
        this.fetchCategories();
    }

    fetchCategories = async () => {
        this.setState(() => {
            return {
                loading: true
            }
        });

        API.get('CATEGORIESCRUD','/CATEGORIES')
            .then(data => {
                console.log(data);
                this.setState({
                    data: data,
                    loading: false
                });
            })
            .catch ( err => console.log(err));
    }

    deleteCategory(categoryToDeleteName){
        let myInit = { 
            headers: {} 
        }
        API.del('CATEGORIESCRUD','/CATEGORIES/object/'+categoryToDeleteName,myInit )
        .then(data => {
            console.log(data);
            this.setState({
                data: data,
                loading: false
            });
        })
        .catch ( err => console.log(err))
        this.fetchCategories();
    }


    render() {
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
                        <Table selectable>
                            <Table.Header className="categoriesHeader">
                                <Table.Row>
                                    <Table.HeaderCell>Catégories </Table.HeaderCell>
                                    <Table.HeaderCell width={2} ></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.data.map((data) =>
                                    <Table.Row key={data.NAME}>
                                        <Table.Cell>{data.NAME}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                                <img src={require('../Images/closeIcon.png')} 
                                                onClick={() => {if(window.confirm("Tu veux vraiment supprimer cette catégorie ?")) this.deleteCategory(data.NAME)}}
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