'use client';
import React, { forwardRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import 'ckeditor5/ckeditor5.css';

const Ckeditor = ({ ...props }: any) => {
  const [isReady, setIsReady] = React.useState(false);
  return (
    <>
      {!isReady && <div className='px-5 py-3 rounded-md'>Loading...</div>}
      <CKEditor
        editor={ClassicEditor as any}
        onReady={() => setIsReady(true)}
        {...props}
      />
    </>
  );
};

export default Ckeditor;