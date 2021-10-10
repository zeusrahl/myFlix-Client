import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './genre-view.scss';

export class GenreView extends React.Component {

  render() {
    const { genre, onBackClick } = this.props;

    return (
      <div className="genre-view">
        <div className="genre-name">
          <span className="label">Name: </span>
          <span className="value">{genre.Name}</span>
        </div>
        <div className="genre-description">
          <span className="label">Description: </span>
          <span className="value">{genre.Description}</span>
        </div>

        <Button variant='primary' onClick={() => { onBackClick(null); }}>
          Back
        </Button>
      </div>
    );
  }
}

GenreView.propTypes = {
  genreData: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
  }).isRequired
};

export default GenreView