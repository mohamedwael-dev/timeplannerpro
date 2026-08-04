import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container">
        <p className="error-code">404</p>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link className="primary-button" to="/">
          Back to Home
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default NotFound
