import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

export function getEditorStateFromHtml(text){
    const contentBlock = htmlToDraft(text);
    let editorState= EditorState.createEmpty();
    if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        editorState= EditorState.createWithContent(contentState);
    }
    return editorState;
}