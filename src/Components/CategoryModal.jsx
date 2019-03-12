import React from 'react';
import PropTypes from 'prop-types';
import { Button} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {addCategory} from '../actions/index.js';
import './../css/api.css';
import {postCategory} from '../API/fetchApi';
import {hasNoDuplicateForColumnName} from '../API/generalApi';
import {FormattedMessage, defineMessages} from 'react-intl';
import * as Constants from '../Globals/Constants';

class CategoryModal extends React.Component {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool,
        children: PropTypes.node,
        displayNotification: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            date: new Date()
        };
      }


      //Create a new category on server side
      handleSubmit = (event) => {
        event.preventDefault();
        const categoryName = this.state.name;
        const messages = defineMessages({
            successMessage: {
              id: "Categories.categoryAddedWithSuccess",
              defaultMessage: "Catégorie ajoutée.",
            },
            errorMessage: {
                id: "Categories.errorWhileAddingCategory",
                defaultMessage: "Erreur lors de l'ajout.",
              },
          });
        if(this.hasNoDuplicate(categoryName)){
            postCategory(categoryName)
            .then(data => {
                console.log(data);
                this.props.addCategory(categoryName);
                this.props.displayNotification("success",messages.successMessage);
            })
            .catch((error) => {
                console.log(error);
                this.props.displayNotification("error",messages.errorMessage);
            });
            this.props.onClose();
        }
    };

    //Check if there is a category with the name chosen by the user already exist
    hasNoDuplicate = (categoryName) => {
        const {categories} = this.props;
        const messages = defineMessages({
            infoMessage: {
              id: "Categories.duplicateCategory",
              defaultMessage: "Cette catégorie existe déjà.",
            },
          });
        const result = hasNoDuplicateForColumnName(categoryName, categories);
        if(!result){
            this.props.displayNotification("info",messages.infoMessage);
        }
        return result;
    }

    //Update the name of the category to add
    handleChange(event) {
        this.setState({name: event.target.value})
      }

    render() {
        if(!this.props.show) {
        return null;
        }

        return (
        <div className="backdrop-content">
            <div className="modal-content">
                <div>
                    <img src={Constants.CLOSE_ICON2_PATH} 
                        onClick={() => {this.props.onClose();}}
                        className="icon-style"
                        width="16" 
                        height="16" 
                    />
                </div>
                <div 
                    className ="modal-title">
                    
                    <FormattedMessage
                        id="Categories.newCategoryCreation"
                        defaultMessage="Création d'une nouvelle catégorie "
                    />
                </div>
                <form onSubmit={this.handleSubmit}> 
                    <label> 
                        Nom : 
                        <input 
                            autoFocus 
                            onChange={this.handleChange.bind(this)} 
                            type="text" 
                            name="categoryName" 
                            value={this.state.name} />
                    </label>
                    <button 
                        className='saveData' >
                        Créer
                    </button>
                </form>
            </div>
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addCategory}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(CategoryModal);

  