import React, { Component } from 'react';
import './css/general.css';
import { connect } from 'react-redux';

import {FormattedMessage} from 'react-intl';

class Home extends Component{

    render() {
        return (
            <div 
            className="content-text"> 
                Bienvenue sur l'interface administrateur pour l'appli PSB
                <div 
                    className="next-paragraph">
                    <FormattedMessage
                    id="Home.thereIs"
                    defaultMessage="Il y a actuellement :"
                    />
                    <ul
                    style={{marginLeft:20}}
                    >
                        <li>- {}
                            <FormattedMessage
                                id='Home.categories'
                                defaultMessage={'{total} catégories'}
                                values={{
                                    total:this.props.categories.length
                                }}
                            />
                        </li>
                        <li>- {}
                            <FormattedMessage
                                id="Home.currentProjects"
                                defaultMessage={'{total} projets en cours'}
                                values={{
                                    total:this.props.projects.length
                                }}
                            />
                        </li>
                    </ul>
                </div>
                <div
                    className="next-paragraph">
                    <FormattedMessage
                        id="Home.lastUpdate"
                        defaultMessage='Dernière mise à jour : le {lastUpdate}'
                        values={{
                            lastUpdate:this.props.lastUpdatedDate
                        }}
                    />
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        projects: state.projects,
        lastUpdatedDate: state.utilities.lastUpdatedDate
    }
}

export default connect(mapStateToProps,null)(Home);
