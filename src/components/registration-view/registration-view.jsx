import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './registration-view.scss';
import { Form } from 'react-bootstrap';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email, birthDate);
    props.onRegistration(username);
  }

  return (
    /* 
    <Form>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control 
          type="text" 
          onChange={e => setUsername(e.target.value)} 
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control 
          type="text" 
          onChange={e => setPassword(e.target.value)} />
      </Form.Group>"
      <Buton 
        variant="primary" 
        type="submit" 
        onClick={handleSubmit}>
        Submit
      </Buton>
    </Form>
    */
    <Form>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control 
          type="text"
          onChange={e => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control 
          type="text"
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control 
          type="text"
          onChange={e => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formBirthDate">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="text"
          onChange={e => setBirthDate(e.target.value)}
        />
      </Form.Group>
    </Form>
    /* <form>
      <label>
        Birthday:
        <input 
          type='text' 
          value={birthDate} 
          onChange={e => setBirthDate(e.target.value)} 
        />
      </label>

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form> */
  );
}

RegistrationView.propTypes = {
  onRegistration: PropTypes.func.isRequired
};