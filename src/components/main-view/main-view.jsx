import React from 'react';
import axios from 'axios';

import './main-view.scss';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

export class MainView extends React.Component {
  
  constructor(){
    super();
// Initial state is set to null
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      register: false
    };
  }

  componentDidMount(){
    axios.get('https://favflix.herokuapp.com/movies')
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  
/* When a movie is clicked, this function is invoked and updates the state of the `selectedMovie` *property to that movie*/
  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }

/* When a user successfully logs in, this function updates the `user` property in state to that *particular user */

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  onRegistration(user) {
    this.setState({
      user
    });
  }

  render() {
    const {movies, selectedMovie, register, user } = this.state;

    if (!register) return <RegistrationView onRegistration={register => this.onRegistration(register)} />;

    /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView */

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // if (selectedMovie) return <MovieView movie={selectedMovie} />

    // Before the movies have been loaded
    if (movies.length === 0) return <div className="main-view" />;

    return (
      <Row className="main-view justify-content-md-center">
        {selectedMovie
          ? (
            <Col md={8}>
              <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }}/>
            </Col>
          )
          : movies.map(movie => (
            <Col md={3}>
              <MovieCard key={movie._id} movie={movie} onMovieClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }}/>
            </Col>
          ))
        }
      </Row>
    );
  }
}