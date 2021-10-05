import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './director-view.scss';

export class DirectorView extends React.Component {

  render() {
    const { movie, onBackClick } = this.props;

    return (
      <div className="director-view">
        <div className="director-name">
          <span className="label">Name: </span>
          <span className="value">{movie.Director.Name}</span>
        </div>
        <div className="director-bio">
          <span className="label">Bio: </span>
          <span className="value">{movie.Director.Bio}</span>
        </div>
        <div className="director-birth">
          <span className="label">Birth: </span>
          <span className="value">{movie.Director.Birth}</span>
        </div>
        <div className="director-death">
          <span className="label">Death: </span>
          <span className="value">{movie.Director.Death}</span>
        </div>

        <Button variant='primary' onClick={() => { onBackClick(null); }}>
          Back
        </Button>
      </div>
    );
  }
}

DirectorView.propTypes = {
  directorData: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
    Death: PropTypes.string.isRequired,
  }).isRequired
};

export default DirectorView