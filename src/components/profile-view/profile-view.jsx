import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Card, CardDeck, Form, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";

import './profile-view.scss';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: [],
      validated: null,
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  // get user method
  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get(`https://favflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      this.setState({
        Username: response.data.Username,
        Password: response.data.Password,
        Email: response.data.Email,
        Birthdate: response.data.Birthdate,
        FavoriteMovies: response.data.FavoriteMovies,
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  removeFavoriteMovie() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`https://favflix.herokuapp.com/users/${username}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    then(() => {
      alert('Movie was removed');
      this.componentDidMount();
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  handleUpdate(e, newUsername, newPassword, newEmail, newBirthdate) {
    this.setState({
      validated: null,
    });

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        validated: true,
      });
      return;
    }
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.put(`https://favflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Username: newUsername ? newUsername: this.state.Username,
        Password: newPassword ? newPassword: this.state.Password,
        Email: newEmail ? newEmail: this.state.Email,
        Birthdate: newBirthdate ? newBirthdate: this.state.Birthdate,
      },
    })
    .then((response) => {
      alert('Saved Changes');
      this.setState({
        Username: response.data.Username,
        Password: response.data.Password,
        Email: response.data.Email,
        Birthdate: response.data.Birthdate,
      });
      localStorage.setItem('user', this.state.Username);
      window.open(`/users/${username}`, '_self');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  setUsername(input) {
    this.Username = input;
  }

  setPassword(input) {
    this.Password = input;
  }

  setEmail(input) {
    this.Email = input;
  }

  setBirthdate(input) {
    this.Birthdate = input;
  }

  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`https://favflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      alert('Your account has been deleted.');
      window.open(`/`, '_self');
      })
      .catch((e) => {
        console.log(e);
    });
  }

  render() {
    const { FavoriteMovies, validate } = this.state;
    const {movies } = this.props;

    return (
      <Row className='profile-view'>
        <Card className='profile-card'>
          <h2>Favorites</h2>
          <Card.Body>
            {FavoriteMovies.length === 0 && <div className="text-center">Empty</div>}

            <div className='favorite-movies'>
              {FavoriteMovies.length > 0 && movies.map((movie) => {
                if (movie._id === FavoriteMovies.find((favMovie) => favMovie === movie._id)) {
                  return (
                    <CardDeck classname='movie-card-deck'>
                      <Card className='favorites-item card-content' style={{ width: '16rem' }} key={movie._id}>
                        <Card.Img style={{ width: '18rem' }} className='movieCard' variant='top' src={movie.ImagePath} />
                        <Card.Body>
                          <Card.Title className='movie-card-title'>{movie.Title}</Card.Title>
                          <Button size='sm' className='profile-button remove favorite' variant='danger' value={movie._id} onclick={(e) => this.removeFavoriteMovie(e, movie)}>
                            Remove
                          </Button>
                        </Card.Body>
                      </Card>
                    </CardDeck>
                    );
                }
              })}
            </div>
          </Card.Body>

          <h1 className='section'>Update Profile</h1>
          <Card.Body>
            <Form noValidate validate={validated} className='update-form' onSubmit={(e) => this.handleUpdate(e, this.Username, this.Password, this.Email, this.Birthdate)}>

              <Form.Group controlId='formBasicUsername'>
                <Form.Label classname='form-label'>Username</Form.Label>
                <Form.Control type='text' placeholder='Change Username' onChange={(e) => this.setUsername(e.target.value)} />
              </Form.Group>

              <Form.Group controlId='formBasicPassword'>
                <Form.Label classname='form-label'>
                  Username<span className='required'>*</span>
                </Form.Label>
                <Form.Control type='password' placeholder='New Password' onChange={(e) => this.setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group controlId='formBasicEmail'>
                <Form.Label classname='form-label'>Email</Form.Label>
                <Form.Control type='email' placeholder='Change Email' onChange={(e) => this.setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group controlId='formBasicBirthday'>
                <Form.Label classname='form-label'>Birthdate</Form.Label>
                <Form.Control type='date' placeholder='Change Birthdate' onChange={(e) => this.setBirthdate(e.target.value)} />
              </Form.Group>

              <Button variant='danger' type='submit'>
                Update
              </Button>

              <h3>Delete your Account</h3><Card.Body>
                <Button variant='danger' onClick={(e) => this.handleDeleteUser(e)}>
                  Delete Account
                </Button>
              </Card.Body>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    )
  }
}

ProfileView.propTypes = {
  user: PropTypes.shape({
    FavoriteMovies: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequired,
      })
    ),
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthdate: PropTypes.string,
  }),
};