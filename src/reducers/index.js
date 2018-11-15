import {combineReducers} from 'redux';

function helpUs(state = [], action){
    switch(action.type){
        case 'EDIT_WELCOME_TEXT':
            return Object.assign({}, state, {
                welcomeText: action.welcomeText
            })
        case 'EDIT_MEMBERS_TEXT':
            return Object.assign({}, state, {
                membersText: action.membersText
            })
        case 'EDIT_COMPANIES_TEXT':
            return Object.assign({}, state, {
                companiesText: action.companiesText
            })
        default:
            return state
    }
}

function categories(state = [], action){
    switch(action.type){
        case 'ADD_CATEGORY':
            return [
                ...state,
                {
                    name:action.name
                }
            ]
        case 'DELETE_CATEGORY':
            const index = state.map(item => item.name).indexOf(action.name);
            return [
                ...state.slice(0,index),
                ...state.slice(index+1)
            ]
        case 'CLEAN_CATEGORIES':
            return [];
        default:
            return state
    }
}

function projects(state = [], action){
    switch(action.type){
        case 'ADD_PROJECT':
            return [
                ...state,
                {
                    id:action.id,
                    name:action.name,
                    description:action.description,
                    startDate:action.startDate,
                    category:action.category,
                    coverImg:action.coverImg,
                    endDate:action.endDate,
                    location:action.location
                }
            ]
        case 'DELETE_PROJECT':
            const index = state.map(item => item.id).indexOf(action.id);
            return [
                ...state.slice(0,index),
                ...state.slice(index+1)
            ]
        case 'EDIT_PROJECT':
            state.map(item => {
                if(item.id == action.id){
                    item.name=action.name,
                    item.description=action.description,
                    item.startDate=action.startDate,
                    item.category=action.category,
                    item.coverImg=action.coverImg,
                    item.endDate=action.endDate,
                    item.location=action.location
                }
            });
            return state;
        case 'CLEAN_PROJECTS':
            return [];
        default:
            return state
    }
}

export default combineReducers({
    categories,
    projects,
    helpUs
})