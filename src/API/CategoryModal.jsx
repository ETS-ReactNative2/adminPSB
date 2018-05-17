import React from 'react';
import PropTypes from 'prop-types';
import {API} from 'aws-amplify';
import { Button} from 'semantic-ui-react';

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
        this.closeModal = this.closeModal.bind(this);

      }


    closeModal(){
        let requestParams = {
            headers: {'content-type': 'application/json'},
            body : {
                'NAME': this.state.name
            }
        }
        API.post('CATEGORIESCRUD','/CATEGORIES', requestParams)
        .then(data => {
            console.log(data);
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

        const closeButtonStyle = {
            marginTop : '15px',
            marginRight: '15px'
        };

        return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                {this.props.children}
                <div style ={{marginBottom:15}}> Création d'une nouvelle catégorie </div>
                <label> Nom : 
                    <input style={{height: '2rem', width: 200, marginLeft: 20}} onChange={this.handleChange.bind(this)} type="text" name="categoryName" value={this.state.name} />
                </label>
                <div className="footer">
                    <Button.Group>
                        <Button positive style={closeButtonStyle} onClick={this.closeModal}>
                            Créer
                        </Button>
                        <Button style={closeButtonStyle} onClick={this.props.onClose}>
                            Annuler
                        </Button>
                    </Button.Group>
                </div>
            </div>
        </div>
        );
    }
}
  
  export default CategoryModal;
  