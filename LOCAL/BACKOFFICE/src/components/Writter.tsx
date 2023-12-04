import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, convertToRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { convertToHTML } from 'draft-convert';
import { Box } from '@chakra-ui/react';

export default function Writter({onChnage}:{
    onChnage:(plain:string)=>void
}){
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
      );

      const handleEditorChange = (newEditorState:any) => {
        setEditorState(newEditorState);
        
        const contentState = newEditorState.getCurrentContent();

        const htmlContent = convertToHTML({
            styleToHTML: (style) => {
              if (style === 'BOLD') {
                return <strong />;
              }
              if (style === 'ITALIC') {
                return <em />;
              }
            },
            blockToHTML: (block) => {
              if (block.type === 'unstyled') {
                return <p />;
              }
            },
          })(contentState);

        onChnage(htmlContent);
      };
    
     
    
      return( 
        <Box bg="gray.600" minH="20" >

        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
        />
        </Box>
      )
      ;
}
