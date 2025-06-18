import * as yup from 'yup'

const blogSchema = yup.object().shape({
  title: yup
  .string()
  .required("Title is required")
  .max(50),

  content: yup
  .string()
  .required("Content is required")
  .max(10000),

 isPublished: yup.
 boolean()
.transform((value, originalValue) => originalValue === "true")
.optional(),

  description: yup
  .string()
  .max(300)
  .required("Description is required"),

  featuredImage: yup
  .mixed()
    .test("fileType", "Unsupported file format",
        (value) => {
            if(!value || value.length == 0) return true;
            const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
            return supportedFormats.includes(value[0].type) 
        }
    )
    .notRequired(),
});

export default blogSchema;
