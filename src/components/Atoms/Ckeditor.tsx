import React from "react";
import { CKEditor as CKEditorComponent } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "ckbox/dist/styles/themes/lark.css";
import "ckbox/dist/ckbox";

export default function CKEditor({ ...props }) {
  const config = {
    ckbox: {
      tokenUrl: `/api/ckbox`,
      theme: "lark",
    },
    toolbar: [
      "heading",
      "|",
      "undo",
      "redo",
      "|",
      "bold",
      "italic",
      "imageUpload",
      "|",
      "blockQuote",
      "indent",
      "link",
      "|",
      "bulletedList",
      "numberedList",
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    }
  };

  return (
    <>
      <style>{`
        .ck-editor__editable_inline {
          min-height: 200px;
          white-space: normal; /* Ensure text wraps */
          word-wrap: break-word; /* Break long words */
          overflow-wrap: break-word; /* Break long words */
          max-width: 100%; /* Ensure it doesn't overflow its container */
        }
      `}</style>
      <CKEditorComponent editor={ClassicEditor} config={config as any} {...props} />
    </>
  );
}