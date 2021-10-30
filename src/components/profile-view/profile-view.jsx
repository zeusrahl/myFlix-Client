import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Card, CardDeck, Form, Row, Col } from 'react-bootstrap';
import './profile-view.scss';

import { connect } from 'react-redux';

// #0
import { setUser } from '../../actions/actions';


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
    const user = localStorage.getItem('user');
    axios.get(`https://favflix.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("GET USER", this.props.setUser, response.data);
      this.props.setUser(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  removeFavoriteMovie(e, movie) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');


    axios
      .delete(`https://favflix.herokuapp.com/users/${user}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      alert('Movie was removed');
      this.props.setUser(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    // .then(() => window.location.reload());
  }

  handleUpdate(e, newUsername, newPassword, newEmail, newBirthday) {
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

    const { user } = this.props;

    axios.put(`https://favflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Username: newUsername ? newUsername: user.Username,
        Password: newPassword ? newPassword: user.Password,
        Email: newEmail ? newEmail: user.Email,
        Birthday: newBirthday ? newBirthday: user.Birthday,
      },
    })
    .then((response) => {
      alert('Saved Changes');
      this.props.setUser(response.data);
      localStorage.setItem('user', response.data.Username);
      // window.open(`/users/${user}`, '_self');
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

  setBirthday(input) {
    this.Birthday = input;
  }

  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    axios.delete(`https://favflix.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.props.setUser(null);
      alert('Your account has been deleted.');
      window.open(`/`, '_self');
      })
      .catch((e) => {
        console.log(e);
    });
  }

  render() {
    const { FavoriteMovies, validated } = this.state;
    const { movies, user } = this.props;
    console.log("render", user);

    return (
      <Row className='profile-view'>
        <Card className='profile-card'>
          <Col>
          <h2>Username: {`${user.Username}`}</h2>
          <p>Email: {`${user.Email}`}</p>
          <p>Birthday: {`${user.Birthday}`}</p>
          <h2>Favorites</h2>
          </Col>
          
          <Card.Body>
            {user.FavoriteMovies.length === 0 && <div className="text-center">Empty</div>}

            <div className='favorite-movies'>
              {user.FavoriteMovies.length > 0 && user.FavoriteMovies.map((movie) => {
                  console.log('MOVIE', movie);
                  return (
                    <Card className='favorites-item card-content' style={{ width: '16rem' }} key={movie._id}>
                      <Card.Img style={{ width: '18rem' }} className='movieCard' variant='top' src={movie.ImagePath} />
                      <Card.Body>
                        <Card.Title className='movie-card-title'>{movie.Title}</Card.Title>
                        <Button size='sm' className='profile-button remove favorite' variant='danger' value={movie._id} onClick={(e) => this.removeFavoriteMovie(e, movie)}>
                          Remove
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                }
              )}
            </div>
          </Card.Body>

          <h1 className='section'>Update Profile</h1>
          <Card.Body>
            <Form noValidate validated={validated} className='update-form' onSubmit={(e) => this.handleUpdate(e, this.Username, this.Password, this.Email, this.Birthday)}>

              <Form.Group controlId='formBasicUsername'>
                <Form.Label className='form-label'>Username</Form.Label>
                <Form.Control type='text' placeholder='Change Username' onChange={(e) => this.setUsername(e.target.value)} />
              </Form.Group>

              <Form.Group controlId='formBasicPassword'>
                <Form.Label className='form-label'>
                  Username<span className='required'>*</span>
                </Form.Label>
                <Form.Control type='password' placeholder='New Password' onChange={(e) => this.setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group controlId='formBasicEmail'>
                <Form.Label className='form-label'>Email</Form.Label>
                <Form.Control type='email' placeholder='Change Email' onChange={(e) => this.setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group controlId='formBasicBirthday'>
                <Form.Label className='form-label'>Birthday</Form.Label>
                <Form.Control type='date' placeholder='Change Birthday' onChange={(e) => this.setBirthday(e.target.value)} />
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
        _id: PropTypes.string,
        Title: PropTypes.string,
      })
    ),
    Username: PropTypes.string,
    Email: PropTypes.string,
    Birthday: PropTypes.string,
  }),
};

let mapStateToProps = state => {
  return { movies: state.movies, user: state.user }
}

// #8
export default connect(mapStateToProps, { setUser })(ProfileView);