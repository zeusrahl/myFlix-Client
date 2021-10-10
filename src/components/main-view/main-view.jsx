import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import './main-view.scss';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view'
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { NavBar } from '../navbar-view/navbar-view';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }
  
  /* When a movie is clicked, this function is invoked and updates the state of the `selectedMovie` *property to that movie*/
  // setSelectedMovie(newSelectedMovie) {
  //   this.setState({
  //     selectedMovie: newSelectedMovie
  //   });
  // }

  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user */

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getUsers(token) {
    axios.post('https://favflix.herokuapp.com/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      this.setState({
        users: response.data
      });
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // onLoggedOut() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   this.setState({
  //     user: null
  //   });
  // }

  onRegistration(register) {
    this.setState({
      register: register,
    });
  }

  getMovies(token) {
    axios.get('https://favflix.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
      this.setState({
        movies: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const {movies, selectedMovie, register, user } = this.state;
    console.log('render', user);

    // if (!register) return <RegistrationView onRegistration={register => this.onRegistration(register)} />;

    /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView */
    
    // if (selectedMovie) return <MovieView movie={selectedMovie} />

    // Before the movies have been loaded
    

    // if (!movies) return <div className="main-view"/>

    return (
      <Router>
        <NavBar user={user} />
        <Row>
          {/* Link to Profile */}
        </Row>
        <Row className="main-view justify-content-md-center">

          <Route exact path="/" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return movies.map(m => (
              <Col md={3} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ))  
          }} />
          
          {/* <Route exact path='/' render={() => {
            if (!user) return <div className="main-view" />;
            return <Col>
              <Button variant='primary' onClick={() => { this.onLoggedOut() }}>
                Log Out
              </Button>
            </Col>
          }} /> */}

          <Route path="/users" render={() => {
            if (user) return <Redirect to="/" />
            return <Col>
              <RegistrationView />
            </Col>
          }} />

          <Route path="/users/:Username" render={() => {
            if (!user) return <Col>
              <ProfileView />
            </Col>
          }} />

          <Route path="/movies/:movieId" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route path="/director/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
            </Col>
            }
          } />

          <Route path="/genres/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
            </Col>
            }
          } />

          <Route exact path='/users/:Username' render={({ history}) => {
            if (!user) return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />;
            if (movies.length ===0) return;
            return <ProfileView history={history} movies={movies} />
          }} />

          {/* <Route exact path='/' render={() => {
            if (user) return
            <Button variant='primary' onClick={() => { this.onLoggedOut() }}>
              Log Out
            </Button>
          }} /> */}
          
           {/* <Col>
            <button onClick={() => { this.onLoggedOut() }}>Logout</button>
          </Col> */}
        </Row>
      </Router>
      
    );
  }
}
export default MainView