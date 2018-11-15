import React from 'react';
import PropTypes from 'prop-types';
import {API} from 'aws-amplify';
import { Button} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {addCategory} from '../actions/index.js'

class CategoryModal extends React.Component {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool,
        children: PropTypes.node
    };

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            date: new Date()
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }


      handleSubmit(event) {
        event.preventDefault();
        const categoryName = this.state.name;
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME': categoryName
            }
        }
        API.post('CATEGORIESCRUD','/CATEGORIES', requestParams)
        .then(data => {
            console.log(data);
            this.props.addCategory(categoryName);
        })
        .catch((error) => {
            console.log(error);
        });
        this.props.onClose();
    };

    handleChange(event) {
        this.setState({name: event.target.value})
      }

    render() {
        if(!this.props.show) {
        return null;
        }

        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            width:'100%',
            height: '100%',
            padding: 50,
        };

        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 400,
            minHeight: 50,
            margin: '0 auto',
            padding: 20
        };

        return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <div>
                    <img src={require('../Images/closeIcon2.png')} 
                        onClick={() => {this.props.onClose();}}
                        style={{float:"right", cursor: "pointer"}}
                        width="16" 
                        height="16" 
                    />
                </div>
                <div style ={{marginBottom:15, fontWeight: "bold"}}> Création d'une nouvelle catégorie </div>
                <form onSubmit={this.handleSubmit}> 
                    <label> Nom : 
                        <input autoFocus style={{height: '2rem', width: 200, marginLeft: 20}} onChange={this.handleChange.bind(this)} type="text" name="categoryName" value={this.state.name} />
                    </label>
                    <button className='saveData' >
                        Créer
                    </button>
                </form>
            </div>
        </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addCategory}, dispatch);
}

export default connect(null,mapDispatchToProps)(CategoryModal);

  