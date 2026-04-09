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
        <div className="profile-container">
          <div className="profile-text-content">
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
                  <a href="https://github.com/roman-kupar/portfolio" target="_blank" rel="noopener noreferrer">
                    <h3>Portfolio</h3>
                  </a>
                  <p>My personal portfolio project showcasing my skills and applications.</p>
                </div>
                <div className="project-card">
                  <a href="https://github.com/roman-kupar/react-chess" target="_blank" rel="noopener noreferrer">
                    <h3>React Chess</h3>
                  </a>
                  <p>A fully functional 2-player chess game built with React and TypeScript. Play below!</p>
                </div>
                <div className="project-card">
                  <a href="https://github.com/roman-kupar/elementals" target="_blank" rel="noopener noreferrer">
                    <h3>Elementals</h3>
                  </a>
                  <p>Artemis Destroyers</p>
                </div>
                <div className="project-card">
                  <a href="https://github.com/roman-kupar/swift-kotlin" target="_blank" rel="noopener noreferrer">
                    <h3>Swift-Kotlin</h3>
                  </a>
                  <p>Java/Kotlin interopability support for Swift</p>
                </div>
                <div className="project-card">
                  <a href="https://github.com/roman-kupar/Rider-Godot-UX" target="_blank" rel="noopener noreferrer">
                    <h3>Rider-Godot-UX</h3>
                  </a>
                  <p>UX improvements for Rider's Godot integration.</p>
                </div>
                <div className="project-card">
                  <a href="https://github.com/roman-kupar/jb-internship-2025-material" target="_blank" rel="noopener noreferrer">
                    <h3>JB Internship 2025</h3>
                  </a>
                  <p>Fork from "Rendering iOS Simulator on IntelliJ IDEA and Android Studio" internship task project</p>
                </div>
              </div>
            </section>
          </div>

          <div className="profile-card">
            <div className="profile-image-placeholder">
              <img src="/src/assets/profile/profile_picture.png" alt="Profile" />
            </div>
            <a 
              href="https://www.linkedin.com/in/roman-kupar/"
              target="_blank" 
              rel="noopener noreferrer" 
              className="linkedin-btn"
            >
              Connect on LinkedIn 🔗
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export default Portfolio;
