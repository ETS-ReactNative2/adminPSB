import {Auth} from 'aws-amplify';

export function signOut(){
    return Auth.signOut();
}

export function signIn(username, password){
    return Auth.signIn(username, password);
}