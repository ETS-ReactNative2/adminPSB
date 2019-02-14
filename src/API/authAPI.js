import {Auth} from 'aws-amplify';

export function signOut(){
    return Auth.signOut();
}