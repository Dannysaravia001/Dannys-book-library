// Import necessary libraries and components
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../utils/mutations";
import Auth from '../utils/auth';

const LoginForm = () => {
  // State for user form data
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // State for form validation
  const [validated] = useState(false);
  // State for showing alert
  const [showAlert, setShowAlert] = useState(false);

  // Declaring loginUser with useMutation
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  // Effect to show alert if there's an error
  useEffect(() => {
    if (error) setShowAlert(true);
    else setShowAlert(false);
  }, [error]);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check form validation
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Login user
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      // Save token to local storage
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // Reset form data
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      {/* Login form */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert for showing errors */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        {/* Email input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Password input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Submit button */}
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;