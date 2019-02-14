import {API} from 'aws-amplify';
import axios from 'axios';

//Delete a category on server side
export function delCategory (categoryToDeleteName){
    let myInit = { 
        headers: {} 
    }
    return API.del('CATEGORIESCRUD','/CATEGORIES/object/'+categoryToDeleteName,myInit );
};

//Delete a project on server side
export function delProject (projectToDeleteId){
    let myInit = { 
        headers: {} 
    }    
    return API.del('PROJECTSCRUD','/PROJECTS/object/'+projectToDeleteId,myInit );
};

export function postCategory(categoryName){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'NAME': categoryName
        }
    }
    return API.post('CATEGORIESCRUD','/CATEGORIES', requestParams)
}

export function postProject(id, name, description, startDate, category, coverImage, location){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'ID': id,
            'NAME': name,
            'DESCRIPTION': description,
            'START_DATE': startDate,
            'CATEGORY': category,
            'COVER_IMG': coverImage,
            'LOCATION' : location
        }
    }
    return API.post('PROJECTSCRUD','/PROJECTS', requestParams)
}

export function getSignedUrlToPostFile(file){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body: {
            'filename': file.name,
            'filetype': file.type
        }
    };
    return API.post('UPLOAD','/getSignedUrl', requestParams)
}

export function postFile(file, signedUrl){
    var options = {
        headers: {
            'Content-Type': file.type
        }
    };

    return axios.put(signedUrl, file, options);
}

export function putProject(id, name, description, startDate, endDate, category, coverImage, location){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'ID': id,
            'NAME': name,
            'DESCRIPTION': description,
            'START_DATE': startDate,
            'END_DATE': endDate,
            'CATEGORY': category,
            'COVER_IMG': coverImage,
            'LOCATION' : location
        }
    }
    return API.post('PROJECTSCRUD','/PROJECTS', requestParams)
}

export function postLastUpdatedDate(){
    let d = new Date();
    const year = d.getFullYear().toString();
    const month = (d.getMonth()+1).toString().length==2?(d.getMonth()+1):"0"+(d.getMonth()+1).toString();
    const day = d.getDate().toString()==2?d.getDate().toString(): "0"+d.getDate().toString();
    const hours = d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString();
    const mn = (parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString();
    let currentDate = day+"/"+month+"/"+year+", à"+hours+"h"+mn;
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'NAME': 'LAST_UPDATED_DATE',
            'VALUE': currentDate
        }
    }
    API.post('MISC','/ADMIN', requestParams)
}

export function postHelpUsDescription(welcomeText){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'NAME':'WELCOME_TEXT',
            'CONTENT': welcomeText
        }
    }
    return API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
}

export function postHelpUsMembers(membersText){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'NAME': 'MEMBERS_TEXT',
            'CONTENT': membersText
        }
    }
    return API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
}

export function postHelpUsCompanies(companiesText){
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body : {
            'NAME': 'COMPANIES_TEXT',
            'CONTENT': companiesText
        }
    }
    return API.post('DESCRIPTIONCRUD','/DESCRIPTION', requestParams)
}

export function getProjects(){
    return API.get('PROJECTSCRUD','/PROJECTS');
}

export function getCategories(){
    return API.get('CATEGORIESCRUD','/CATEGORIES');
}

export function getWelcomeHelpUs(){
    return API.get('DESCRIPTIONCRUD','/DESCRIPTION/WELCOME_TEXT');
}

export function getMembersHelpUs(){
    return API.get('DESCRIPTIONCRUD','/DESCRIPTION/MEMBERS_TEXT');
}

export function getCompaniesHelpUs(){
    return API.get('DESCRIPTIONCRUD','/DESCRIPTION/COMPANIES_TEXT');
}

export function getLastUpdatedDate(){
    return API.get('MISC','/ADMIN/LAST_UPDATED_DATE');
}