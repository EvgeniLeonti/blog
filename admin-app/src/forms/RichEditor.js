import React, {useEffect, useState} from 'react'

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const RichEditor = (props) => {
    let value;
    if (props.value) {
        value = props.value;
    }
    else {
        value = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    }
    const contentBlock = htmlToDraft(value);
    
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(contentBlock.contentBlocks)));
    
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    
        props.onChange({
            target: {
                name: props.name,
                value: draftToHtml(convertToRaw(editorState.getCurrentContent()))
            }
        })
    };
    
    return (
        <Editor
            editorState={editorState} onEditorStateChange={onEditorStateChange}
        />
    );
};

export default RichEditor;