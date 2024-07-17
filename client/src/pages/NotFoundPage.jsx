import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 text-danger">404</h1>
      <p className="lead">Oops! Looks like you've wandered off the beaten path.</p>
      <Link to="/" className="btn btn-primary">Go back to the home page</Link>
    </div>
  );
};

export default NotFoundPage;