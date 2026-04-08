import './Portfolio.css';

function Portfolio() {
  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <h1>Roman Kupar</h1>
          <nav className="portfolio-nav">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="portfolio-content">
        <section id="about" className="portfolio-section">
          <h2>About Me</h2>
          <p>
            Hello! I'm a passionate software developer specializing in building modern web applications
            and backend services. I enjoy solving complex problems and creating elegant, user-friendly
            interfaces. Welcome to my portfolio!
          </p>
        </section>

        <section id="projects" className="portfolio-section">
          <h2>My Projects</h2>
          <p>
            Here are some of the things I've been working on. I love combining different technologies
            to build robust and scalable systems.
          </p>
          <div className="project-grid">
            <div className="project-card">
              <h3>React Chess</h3>
              <p>A fully functional 2-player chess game built with React and TypeScript. Play below!</p>
            </div>
            <div className="project-card">
              <h3>More Coming Soon</h3>
              <p>Check back later for more exciting projects!</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Portfolio;
