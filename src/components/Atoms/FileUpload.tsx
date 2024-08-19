import Image from 'next/image';
import React, { memo, ReactNode, use, useMemo, useState } from 'react';
import { FaXmark } from "react-icons/fa6";
import { UseFormSetValue } from 'react-hook-form';

interface FileUploadProps {
  multiple?: boolean;
  files?: (FileUploadProps["multiple"] extends true ? (File[] | UploadedFile[]) : (File | UploadedFile));
  setFiles: UseFormSetValue<any>; // Update the type of setFiles
  name: string;
};

interface UploadedFile {
  file_path: string;
  preview: string;
}

const FileUpload = React.forwardRef<any, FileUploadProps>(({ files, name, setFiles, multiple = false }, ref) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (multiple) {
      setFiles(name, fileList);
    } else {
      setFiles(name, fileList?.[0]);
    }
  };

  const handleRemove = (index: number) => {
    if (multiple && Array.isArray(files)) {
      const newFiles = files?.filter((_, i) => i !== index);
      setFiles(name, newFiles);
    } else {
      setFiles(name, undefined);
    }
  }


  if (!multiple) {
    return (
      <div className='p-3 border rounded-md border-gray-200'>
        {!files && (
          <input type="file" multiple={multiple} onChange={handleFileChange} />
        )}
        {
          !!files && (
            <div className='flex gap-2'>
              {!(files instanceof File) ? <FileResultPreview file={files} handleRemove={() => setFiles(name, null)} /> : (
                <FileUploadPreview file={files as File} index={0} handleRemoveFile={handleRemove} />
              )}
            </div>
          )
        }
      </div>
    )
  }

  return (
    <div className='p-3  border rounded-md border-gray-200'>
      {Array.isArray(files) && files.length === 0 && (
        <input type="file" multiple={multiple} onChange={handleFileChange} />
      )}
      <div className='flex gap-2'>
        {Array.isArray(files) && files.map((file, index) => {
          if (!(files instanceof File)) {
            return <FileResultPreview file={file} key={index} handleRemove={() => handleRemove(index)} />
          } else {
            return <FileUploadPreview file={file.preview} key={index} index={index} handleRemoveFile={handleRemove} />
          }
        }
        )}
      </div>
    </div>
  );
})

const FileResultPreview = ({ file, handleRemove }: { file: UploadedFile, handleRemove: () => void }) => {
  const filename = useMemo(() => {
    const name = file.file_path.split('/').pop() ?? "";
    const partedName = name?.split('.')[0] ?? '';

    if (partedName?.length > 10) {
      return name.slice(0, 10) + '...';
    } else {
      return name.split('.')[0];
    }
  }, [file])

  const fileExt = useMemo(() => {
    return file.file_path.split('.').pop()?.match(/[^?]+/)?.[0];
  }, [file.file_path]);

  return (
    <div>
      <div className='p-2 w-fit rounded-md border border-slate-400 relative '>
        <button title='Hapus gambar' type='button' onClick={() => handleRemove()} className='p-1 bg-red-600 border border-black text-white top-0 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full absolute right-0 '>
          <FaXmark size={10} />
        </button>
        <Image src={file.preview} width={80} height={80} alt='file' />
      </div>
      <div className='text-xs mt-1 text-ellipsis'>{`${filename}.${fileExt}`}</div>
    </div>
  );
}

const FileUploadPreview = memo(({ file, index, handleRemoveFile }: { file: File, index: number, handleRemoveFile: (index: number) => void }) => {
  const isImage = file.type.startsWith('image/');
  let inner: ReactNode;
  const fileExt = useMemo(() => file.name.split('.').pop(), [file.name]);
  const filePreview = useMemo(() => {
   return URL.createObjectURL(file);
  },[file])
  const fileSize = useMemo(() => {
    let size = file.size;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  }, [file.size]);
  const fileName = useMemo(() => {
    if (file.name.length > 10) {
      return file.name.split(".")[0].slice(0, 10) + '...';
    } else {
      return file.name.split(".")[0];
    }
  }, [file.name]);

  if (isImage) {
    inner = <Image src={filePreview} width={80} height={80} alt={file.name} />
  } else {
    const fileType = file.type.split('/')[1];
    let icon = '';
    switch (fileType) {
      case 'pdf':
        icon = 'pdf-icon';
        break;
      case 'doc':
      case 'docx':
        icon = 'word-icon';
        break;
      case 'xls':
      case 'xlsx':
        icon = 'excel-icon';
        break;
      case 'ppt':
      case 'pptx':
        icon = 'powerpoint-icon';
        break;
      default:
        icon = 'generic-file-icon';
        break;
    }

    return <div className={icon}></div>;
  }

  return (
    <div>
      <div className='p-2 w-fit rounded-md border border-slate-400 relative '>
        <button title='Hapus gambar' type='button' onClick={() => handleRemoveFile(index)} className='p-1 bg-red-600 border border-black text-white top-0 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full absolute right-0 '>
          <FaXmark size={10} />
        </button>
        {inner}
      </div>
      <div className='text-sm mt-1 text-ellipsis'>{fileName + "." + fileExt}</div>
      <div className='text-xs mt-1'>{fileSize}</div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;