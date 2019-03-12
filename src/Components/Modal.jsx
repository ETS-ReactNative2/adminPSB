import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Constants from '../Globals/Constants';

export default class Modal extends Component{
    
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool,
        children: PropTypes.node,
        title: PropTypes.node.isRequired
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
            overflowY: 'auto'
        };
    return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                <div style={{backgroundColor: "#D3D3D3", height: 60, padding: "20px"}}>
                    <div>
                        <img src={Constants.CLOSE_ICON2_PATH} 
                            onClick={() => {this.props.onClose();}}
                            style={{float:"right", cursor: 'pointer',}}
                            width="16" 
                            height="16" 
                        />
                    </div>
                    <div  style ={{marginBottom:15, fontWeight: "bold"}}> {this.props.title} </div>
                </div>
                <div className="scroll" style={{margin: "20px"}}>
                    {this.props.children}
                </div>
            </div>
        </div>
    );
    }
}