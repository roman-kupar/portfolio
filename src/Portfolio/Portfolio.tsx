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
                <div className="about-and-profile">
                    <div className="paragraphs-column">
                        <section id="about" className="portfolio-section about-section">
                            <h2>About Me</h2>
                            <p>
                                Hello! I'm a passionate software developer specializing in building modern web
                                applications
                                and backend services. I enjoy solving complex problems and creating elegant,
                                user-friendly
                                interfaces. Welcome to my portfolio!
                            </p>
                        </section>

                        <section className="portfolio-section projects-intro">
                            <h2>My Projects</h2>
                            <p>
                                Here are some of the things I've been working on. I love combining different
                                technologies
                                to build robust and scalable systems.
                            </p>
                        </section>
                    </div>

                    <div className="profile-card">
                        <div className="profile-image-placeholder">
                            <img src="/src/assets/profile/profile_picture.png" alt="Profile"/>
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

                <section id="projects" className="portfolio-section projects-section">
                    <div className="project-grid">
                        <div className="project-card">
                            <a href="https://github.com/roman-kupar/swift-kotlin" target="_blank"
                               rel="noopener noreferrer">
                                <img src="/src/assets/profile/swift-kotlin.png" alt="Swift-Kotlin" style={{ objectFit: 'contain', backgroundColor: '#f0f0f0' }}/>
                                <h3>Swift-Kotlin</h3>
                            </a>
                            <p>Java/Kotlin interopability support for Swift</p>
                        </div>
                        <div className="project-card">
                            <a href="https://github.com/roman-kupar/RaidersInSpace" target="_blank"
                               rel="noopener noreferrer">
                                <img src="/src/assets/profile/space-raiders.png" alt="RaidersInSpace"/>
                                <h3>RaidersInSpace</h3>
                            </a>
                            <p>A 2D top-down shooter game made with Godot and C#.</p>
                        </div>
                        <div className="project-card">
                            <a href="https://github.com/roman-kupar/react-chess" target="_blank"
                               rel="noopener noreferrer">
                                <img src="/src/assets/profile/react-chess.png" alt="React Chess"/>
                                <h3>React Chess</h3>
                            </a>
                            <p>A fully functional 2-player chess game built with React and TypeScript. Play
                                below!</p>
                        </div>
                        <div className="project-card">
                            <a href="https://wivest.itch.io/elementrip" target="_blank"
                               rel="noopener noreferrer">
                                <img src="/src/assets/profile/elementrip.jpg" alt="Elementals"/>
                                <h3>Elementals</h3>
                            </a>
                            <p>Artemis Destroyers</p>
                        </div>
                        <div className="project-card">
                            <a href="https://github.com/roman-kupar/jb-internship-2025-material" target="_blank"
                               rel="noopener noreferrer">
                                <img src="/src/assets/profile/jb-task.png" alt="JB Internship 2025"/>
                                <h3>API reverse-engineering</h3>
                            </a>
                            <p>Fork from "Rendering iOS Simulator on IntelliJ IDEA and Android Studio"
                                internship task project</p>
                        </div>
                        <div className="project-card">
                            <a href="https://github.com/DERIYS/cache-simulation" target="_blank"
                               rel="noopener noreferrer">
                                <img src="/src/assets/profile/cache.png" alt="Cache Simulation" style={{ objectFit: 'contain', backgroundColor: '#f0f0f0' }}/>
                                <h3>Cache Simulation</h3>
                            </a>
                            <p>A cache simulation tool with different replacement policies.</p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Portfolio;
