import * as yup from 'yup'
const FILE_SIZE = 5 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/*"];
const signupSchema = yup.object().shape({
    email: yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),

    password: yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required."),

     confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required('Password is required.'),

   username: yup.string()
    .required('Username is required.')
    .min(3, "Username must be at least 3 characters"),

    avtar: yup
    .mixed()
    .test("required", "Avatar is required", value => value && value.length > 0)
    .test("fileSize", "File size is too large", value => {
      return value && value[0]?.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", value => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      return value && validTypes.includes(value[0]?.type);
    }),

})

export default signupSchema