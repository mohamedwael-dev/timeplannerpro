function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p>&copy; {new Date().getFullYear()} TimePlanner Pro</p>
        <p>
          Browser language: <span>{navigator.language}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
