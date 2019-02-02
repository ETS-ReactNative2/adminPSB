import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup.js';
import {API} from 'aws-amplify';
import './css/general.css';
import { connect } from 'react-redux';

class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            lastUpdatedDate: ""
        };
    }

    componentDidMount() {
        this.fetchLastUpdateDate();
    }
    
    //Fetch the last updated date from server 
    fetchLastUpdateDate = async () => {
    API.get('MISC','/ADMIN/LAST_UPDATED_DATE')
        .then(data => {
            console.log(data);
            const lastUpdatedDate = data[0].VALUE;
            if(lastUpdatedDate){
                this.setState({
                    lastUpdatedDate : lastUpdatedDate
                })
            }
        })
        .catch ( err => console.log(err))
    }

    render() {
        return (
            <div 
            className="content-text"> 
                Bienvenue sur l'interface administrateur pour l'appli PSB
                <div 
                    className="next-paragraph">
                    Il y a actuellement :
                    <ul
                    style={{marginLeft:20}}
                    >
                        <li>- {this.props.categories.length} categories</li>
                        <li>- {this.props.projects.length} projets en cours</li>
                    </ul>
                </div>
                <div
                    className="next-paragraph">
                    Dernière mise à jour : le {this.state.lastUpdatedDate}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        projects: state.projects
    }
}

export default connect(mapStateToProps,null)(Home);
