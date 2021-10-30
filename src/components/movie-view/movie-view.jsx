import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import axios from 'axios';

import { connect } from 'react-redux';

// #0
import { setUser } from '../../actions/actions';

import './movie-view.scss';

export class MovieView extends React.Component {

  keypressCallback(event) {
    console.log(event.key);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keypressCallback);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.keypressCallback);
  }

  addFavorite() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.post(`https://favflix.herokuapp.com/users/${username}/movies/${this.props.movie._id}`,{}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      this.props.setUser(response.data);
      alert(`Added to Favorites List`)
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  render() {
    const { movie, onBackClick, user } = this.props;

    return (
      <div className="movie-view">
        <div className="movie-poster">
          <img src={movie.ImagePath} alt="Display Image"  crossOrigin='true' />
        </div>
        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>
        <div className="movie-genre">
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">Genre</Button>
          </Link>
          <span className="value">{movie.Genre.Name}</span>
        </div>
        <div className="movie-director">
        <Link to={`/director/${movie.Director.Name}`}>
            <Button variant="link">Director</Button>
          </Link>
          <span className="value">{movie.Director.Name}</span>
        </div>

        <Button variant='danger' disabled={user.FavoriteMovies.find((m) => m._id == movie._id)} className='fav-button' value={movie._id} onClick={(e) => this.addFavorite(e, movie)}>
          Add to Favorites
        </Button>
        <Button variant='primary' onClick= {() => {onBackClick(null); }}>
          Back
        </Button>
      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Featured: PropTypes.bool,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    })
  }).isRequired
};

let mapStateToProps = state => {
  return { movies: state.movies, user: state.user }
}

// #8
export default connect(mapStateToProps, { setUser })(MovieView);