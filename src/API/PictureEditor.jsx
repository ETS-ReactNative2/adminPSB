import React from 'react';
import { Editor } from '../../src';
import './../css/form.css';
import './../css/editor.css';
import axios from 'axios';
import {API} from 'aws-amplify';

function uploadImageCallBack(file) {
    let requestParams = {
        headers: {'content-type': 'application/json'},
        body: {
            'filename': file.name,
            'filetype': file.type
        }
    };
    return API.post('UPLOAD','/getSignedUrl', requestParams)
    .then(function (result) {
        var signedUrl = result.data.signedUrl;
        
        var options = {
            headers: {
                'Content-Type': file.type
            }
        };

        return axios.put(signedUrl, file, options);
    })
    .then(function (result) {
        console.log(result);
        return result;
    })
    .catch(function (err) {
        console.log(err);
        throw err;
    });
}

const editorStyle ={
    borderStyle: 'solid',
    borderRadius: '4px',
    borderWidth: '1px',
    borderColor: '#ccc',
    width: '100%',
    minHeight: 200
}

const ImageUpload = () =>
    (<div style={editorStyle} >
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorStyle"
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
                image: {
                    uploadCallback: this.uploadImageCallBack,
                    previewImage: true,
                    alt: { present: true, mandatory: false },
                },
            }}
        />
    </div>);

export default ImageUpload;