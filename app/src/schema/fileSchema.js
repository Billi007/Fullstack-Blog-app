import * as yup from 'yup'

const fileSchema = yup.object().shape({
  file: yup
    .mixed()
    .test("file-type", "Unsupported file type", (value) => {
      return value && ["image/jpeg", "image/png"].includes(value.type);
    })
});

export default fileSchema;
