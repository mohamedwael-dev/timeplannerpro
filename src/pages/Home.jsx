import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    title: 'Plan with clarity',
    text: 'Turn everything on your mind into an organized plan you can act on.',
  },
  {
    number: '02',
    title: 'Protect your focus',
    text: 'Keep your priorities visible and spend your time on what matters most.',
  },
  {
    number: '03',
    title: 'Build momentum',
    text: 'Move through your day with a simple view of what is done and what is next.',
  },
]

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Your day, intentionally planned</p>
            <h1>Make time work for your priorities.</h1>
            <p className="hero-description">
              TimePlanner Pro gives you one calm place to organize tasks, shape
              your day, and keep important work moving forward.
            </p>
            <Link className="primary-button" to="/tasks">
              Start planning
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="planner-preview" aria-label="Example daily plan">
            <div className="preview-header">
              <div>
                <span>Today</span>
                <strong>Sunday, August 2</strong>
              </div>
              <span className="progress-value">75%</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span />
            </div>
            <div className="preview-list">
              <div className="preview-task is-complete">
                <span className="task-check">✓</span>
                <div>
                  <strong>Review weekly priorities</strong>
                  <small>8:30 AM</small>
                </div>
              </div>
              <div className="preview-task">
                <span className="task-check" />
                <div>
                  <strong>Focus session</strong>
                  <small>10:00 AM</small>
                </div>
                <span className="task-tag">Important</span>
              </div>
              <div className="preview-task">
                <span className="task-check" />
                <div>
                  <strong>Plan tomorrow</strong>
                  <small>4:30 PM</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">A better daily rhythm</p>
            <h2>Simple tools for meaningful progress</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
