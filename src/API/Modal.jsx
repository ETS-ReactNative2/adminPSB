import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Modal extends Component{
    
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool,
        children: PropTypes.node,
        title: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
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
            maxWidth: '80%',
            maxHeight: '100%',
            margin: '0 auto',
            padding: 20,
            overflowY: 'auto'
        };
    return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <div>
                    <img src={require('../Images/closeIcon2.png')} 
                        onClick={() => {this.props.onClose();}}
                        style={{float:"right", cursor: 'pointer',}}
                        width="16" 
                        height="16" 
                    />
                </div>
                <div  style ={{marginBottom:15, fontWeight: "bold"}}> {this.props.title} </div>
                <div className="scroll">
                    {this.props.children}
                </div>
            </div>
        </div>
    );
    }
}