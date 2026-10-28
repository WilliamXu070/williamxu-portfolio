import FsdScene from './components/FsdScene.jsx';
import './portfolio.css';

const base = import.meta.env.BASE_URL;

function WaferStudy() {
  return <svg className="wafer-study" viewBox="0 0 480 320" role="img" aria-label="A schematic wafer and connected fabrication steps">
    <defs><clipPath id="wafer-disc"><circle cx="240" cy="159" r="115" /></clipPath></defs>
    <circle cx="240" cy="159" r="115" fill="#3a4548" />
    <g clipPath="url(#wafer-disc)" fill="none" stroke="#8caaa1" strokeWidth=".6" opacity=".65">
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${126 + i * 19} 35v255M120 ${45 + i * 19}h240`} />)}
    </g>
    <path d="m225 45 15 14 15-14" fill="#282d30" />
    <path d="M94 160h92m108 0h92" stroke="#a6b5b0" strokeWidth=".8" />
    <circle cx="94" cy="160" r="4" fill="#a6b5b0" /><circle cx="386" cy="160" r="4" fill="#a6b5b0" />
    <path d="M220 140h40v39h-40z" fill="#a9c2b3" fillOpacity=".5" stroke="#c5d3c8" strokeWidth=".8" />
    <text x="240" y="300" textAnchor="middle" fill="#abbcb5" fontSize="11" fontFamily="Arial,sans-serif">A process, with a history.</text>
  </svg>;
}

export default function PortfolioExperiment() {
  return <>
    <a className="skip-link" href="#projects">Skip to projects</a>
    <main>
      <section className="portfolio-hero" aria-labelledby="name">
        <FsdScene />
        <div className="hero-shade" aria-hidden="true" />
        <nav className="main-nav" aria-label="Main navigation"><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="hero-intro"><h1 id="name">William Xu</h1><p>Optics, perception, and hardware.</p></div>
        <nav className="project-index" aria-label="Featured projects"><a href="#cellscope">CellScope</a><span aria-hidden="true" /><a href="#fsd">FSD</a><span aria-hidden="true" /><a href="#waferwatch">WaferWatch</a></nav>
      </section>

      <section className="selected-work page-width" id="projects" aria-labelledby="work-title">
        <div className="section-intro"><h2 id="work-title">Selected work</h2><p>Things I’ve built, and what I learned along the way.</p></div>
        <div className="work-grid">
          <article className="work-item" id="cellscope">
            <a className="project-art cellscope-art" href="https://ieeexplore.ieee.org/document/10937550" target="_blank" rel="noreferrer"><img src={`${base}projects/cellscope.jpg`} alt="CellScope microscope prototype from my project presentation" loading="lazy" width="1200" height="900" /><span aria-hidden="true">↗</span></a>
            <div className="work-heading"><h3>CellScope</h3><span>Optics & hardware</span></div>
            <p>A computational smartphone microscope, from optical design to image reconstruction.</p>
            <details><summary>Project notes</summary><div><h4>The problem</h4><p>Bring useful microscopy into a compact smartphone-based system.</p><h4>My work</h4><p>Optomechanical prototyping, illumination and acquisition, Python phase retrieval, and experimental validation.</p><a href="https://ieeexplore.ieee.org/document/10937550" target="_blank" rel="noreferrer">Read the publication ↗</a></div></details>
          </article>
          <article className="work-item" id="fsd">
            <a className="project-art fsd-art" href="https://github.com/WilliamXu070/fsd-scene" target="_blank" rel="noreferrer"><img src={`${base}fsd/poster.jpg`} alt="My recorded FSD reconstruction with a Cybertruck, gray detected vehicles, and irregular road surfaces" loading="lazy" width="1280" height="720" /><span aria-hidden="true">↗</span></a>
            <div className="work-heading"><h3>FSD scene reconstruction</h3><span>Work in progress</span></div>
            <p>Exploring how camera observations become a representation of the world around a vehicle.</p>
            <details><summary>Project notes</summary><div><h4>The question</h4><p>How can a perception system turn images into spatial evidence that can be inspected and understood?</p><h4>My work</h4><p>Camera-based perception experiments, model-output inspection, and the scene renderer used on this page.</p><a href="https://github.com/WilliamXu070/fsd-scene" target="_blank" rel="noreferrer">Explore the project ↗</a></div></details>
          </article>
          <article className="work-item" id="waferwatch">
            <a className="project-art wafer-art" href="https://github.com/WilliamXu070/WaferWatch" target="_blank" rel="noreferrer"><WaferStudy /><span aria-hidden="true">↗</span></a>
            <div className="work-heading"><h3>WaferWatch</h3><span>Scientific software</span></div>
            <p>Software for following wafers, process steps, and measurements through fabrication.</p>
            <details><summary>Project notes</summary><div><h4>The problem</h4><p>Keep process definitions, individual wafer histories, and measurements connected as work moves through a lab.</p><h4>My work</h4><p>Workflow modeling and application development around process templates, execution records, measurements, and traceability.</p><a href="https://github.com/WilliamXu070/WaferWatch" target="_blank" rel="noreferrer">View the repository ↗</a></div></details>
          </article>
        </div>
      </section>

      <section className="about-section page-width" id="about" aria-labelledby="about-title"><h2 id="about-title">A little about me</h2><div><p>I’m an Engineering Science student at the University of Toronto. I work across optics, perception, and hardware, and enjoy building the software around physical systems.</p><p>My projects tend to start with something I want to understand, then turn into something I can build and test.</p></div></section>
      <section className="scene-notes page-width" id="scene-notes" aria-labelledby="scene-notes-title"><h2 id="scene-notes-title">The scene on this page</h2><div><p>The homepage plays recorded outputs from my FSD project. It uses the existing Cybertruck and gray actor meshes, filtered road surfaces, lighting, and following camera.</p><p>The approximately 20-second clip loops. Its source observations were recorded at about 2 Hz; interpolation smooths the presentation. This is a research visualization, with visible misses and coarse surfaces.</p><a href={`${base}fsd/ATTRIBUTION.md`} target="_blank" rel="noreferrer">Scene sources and credits ↗</a></div></section>
      <footer className="contact-section page-width" id="contact"><div><p>Have something interesting in mind?</p><a className="email-link" href="mailto:willy.xu@mail.utoronto.ca">Let’s talk.<span aria-hidden="true">↗</span></a></div><nav aria-label="Social links"><a href="https://github.com/WilliamXu070" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/william-xu-willy/" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:willy.xu@mail.utoronto.ca">Email</a></nav><p className="footer-name">William Xu</p></footer>
    </main>
  </>;
}
