import React, { useRef, useState } from 'react'
import JoditEditor from "jodit-react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import blogSchema from '../schema/Blog_schema';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Create_blog = () => {
 const editor = useRef(null);
 const [content, setContent] = useState("");
 const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const config = {
    placeholder : 'Start typing...',
    height: 300,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    uploader: { insertImageAsBase64URI: true },
    buttons: [
    'bold', 'italic', 'underline', '|',
    'ul', 'ol', '|',
   'font', 'fontsize', '|',
  ]
 }

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
        title : '',
        content : "",
       isPublished: false,
       description: '',
      featuredImage: null
    },
    resolver: yupResolver(blogSchema),
  });

  const onsubmit = async (data) => {
    setLoading(true);

    try {
     const file = data.featuredImage?.[0];
     
     const formData = new FormData();
     formData.append("title", data.title);
     formData.append("description", data.description);
     formData.append("content", data.content);
     formData.append("isPublished", data.isPublished);
     if(file){
        formData.append("featuredImage", file)
     }
     
        const res = await axios.post('http://localhost:4000/api/v1/blog/create', formData,
         {withCredentials: true}
        );
      toast.success("Blog created Successfully");
      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
        const errorMessage = error?.response?.data.message || "Something went wrong. Please try again.";
        toast.error(errorMessage);
        console.log(error.message);
    }finally{
        setLoading(false)
    }
  };


  return (
    <>
   <form onSubmit={handleSubmit(onsubmit)} className=' rounded-xs max-w-2xl m-auto mt-16 shadow-md p-10'>
    <h1 className='text-3xl font-bold'>Write a blog</h1>
    
  <fieldset className="fieldset mt-16"> 
  <legend className="fieldset-legend text-black dark:text-white text-sm">Title</legend>
  <input 
  {...register('title')}
  type="text"  
  className="input bg-white dark:bg-black outline-1 w-full" />
   {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}

  <legend className="fieldset-legend text-black dark:text-white text-sm">Description</legend>
  <input 
  {...register('description')}
  type="text"  
  className="input bg-white dark:bg-black outline-1 w-full" />
   {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}


  <legend className="fieldset-legend text-black dark:text-white text-sm">Upload Image</legend>
  <input 
  {...register('featuredImage')}
  type="file"  
  className="input bg-white dark:bg-black outline-1 w-full" />
   {errors.featuredImage && (
          <p className="text-red-500 text-xs">{errors.featuredImage.message}</p>
        )}

  <legend className="fieldset-legend text-black dark:text-white text-sm">Content</legend>
    <div>
      <JoditEditor
        ref={editor}
        config={config}
        value={content}
        onBlur={(newContent) => {
          setContent(newContent);
          setValue('content', newContent, {shouldValidate: true})
        }}
      />
       {errors.content && (
          <p className="text-red-500 text-xs">{errors.content.message}</p>
        )}
    </div>

    <button
          disabled={loading}
          type="submit"
          className="btn mt-4 mr-7 bg-blue-500 border-none text-white dark:text-white hover:opacity-95"
        >
        {
          loading ? (
          <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : ("Create blog")
        }
        </button>
</fieldset>

  <label>
    <span className='label-text'>Publish now?</span>
 <input 
 {...register('isPublished')}
 type="checkbox"
className="checkbox"
  />
    
  </label>
   </form>
    </>
  )
}

export default Create_blog
