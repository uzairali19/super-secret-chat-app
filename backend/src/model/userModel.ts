const yup = require('yup');

const userSchema = yup.object().shape({
    username: yup.string()
    .required('Username is required')
    .min(3,'Username too short!')
    .max(20,'Username too long!'),
});

module.exports = userSchema;
export {};