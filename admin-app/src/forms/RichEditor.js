import React, {useState} from 'react'

import EditorJs from 'react-editor-js';

import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'


export const EDITOR_JS_TOOLS = {
 // table: Table,
 paragraph: Paragraph,
 list: List,
 // warning: Warning,
 // code: Code,
 // linkTool: LinkTool,
 // image: Image,
 // raw: Raw,
 header: Header,
 // quote: Quote,
 // marker: Marker,
 // checklist: CheckList,
 // delimiter: Delimiter,
 // inlineCode: InlineCode,
 // simpleImage: SimpleImage
};


const RichEditor = (props) => {
 let editorInstance;

 
 return (
   <EditorJs onChange={() => {
    if (!editorInstance) {
     return;
    }
    editorInstance.save().then((outputData) => {
     props.onChange({
      target: {
       name: props.name, value: JSON.stringify(outputData)
      }
     });
    }).catch((error) => {
     console.log('Saving failed: ', error)
    });
   }} data={JSON.parse(props.value)} tools={EDITOR_JS_TOOLS} instanceRef={instance => editorInstance = instance} />
 )

};

export default RichEditor;