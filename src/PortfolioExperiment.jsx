import { useEffect, useState } from 'react';
import FsdScene from './components/FsdScene.jsx';
import ProjectArtwork from './components/ProjectArtwork.jsx';
import ProjectPage from './components/ProjectPage.jsx';
import projects from './content/projects.json';
import './portfolio.css';

const bySlug = Object.fromEntries(projects.map(project => [project.slug, project]));
const featured = ['cellscope', 'waferwatch', 'fsd'].map(slug => bySlug[slug]);
const research = ['photonics', 'hackerfab', 'laser-driver'].map(slug => bySlug[slug]);
const team = ['friday', 'halo'].map(slug => bySlug[slug]);
const archive = ['jungle', 'wicker', 'looky', 'newmux', 'astronomy', 'bifrost', 'can-opening', 'framegen'].map(slug => bySlug[slug]);
const projectHref = project => `#/projects/${project.slug}`;

function WorkCard({ project, number, primary = false }) {
  return <article className={`work-item${primary ? ' work-primary' : ''}`} id={project.slug}>
    <a className={`project-art art-${project.art}`} href={projectHref(project)} aria-label={`Read the ${project.title} case study`}><ProjectArtwork project={project} /><span className="art-open" aria-hidden="true">↗</span></a>
    <div className="work-copy"><div className="work-category"><span>{number}</span><span>{project.category}</span></div><h3><a href={projectHref(project)}>{project.title}</a></h3><p>{project.summary}</p><a className="text-link" href={projectHref(project)}>Explore the project <span aria-hidden="true">↗</span></a></div>
  </article>;
}

function HomePage() {
  return <>
    <a className="skip-link" href="#projects">Skip to projects</a>
    <main>
      <section className="portfolio-hero" id="home" aria-labelledby="name">
        <FsdScene /><div className="hero-shade" aria-hidden="true" />
        <nav className="main-nav" aria-label="Main navigation"><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="hero-intro"><h1 id="name">William Xu</h1><p>Optics, perception, and hardware.</p></div>
        <nav className="project-index" aria-label="Featured projects"><a href="#cellscope">CellScope</a><span aria-hidden="true" /><a href="#fsd">FSD</a><span aria-hidden="true" /><a href="#waferwatch">WaferWatch</a></nav>
      </section>
      <section className="selected-work page-width" id="projects" aria-labelledby="work-title">
        <div className="section-intro"><h2 id="work-title">Selected work</h2><p>Instruments, systems, and the software between them.</p></div>
        <WorkCard project={featured[0]} number="01" primary />
        <div className="work-grid">{featured.slice(1).map((project, i) => <WorkCard key={project.slug} project={project} number={`0${i + 2}`} />)}</div>
      </section>
      <section className="research-section page-width" id="research" aria-labelledby="research-title">
        <div className="section-intro"><h2 id="research-title">On the workbench</h2><p>Design studies and ongoing research.</p></div>
        <div className="research-grid">{research.map(project => <article key={project.slug}>
          <a className={`project-art art-${project.art}`} href={projectHref(project)} aria-label={`Read about ${project.title}`}><ProjectArtwork project={project} /></a>
          <p className="work-category">{project.status}</p><h3><a href={projectHref(project)}>{project.title}</a></h3><p>{project.summary}</p><a className="text-link" href={projectHref(project)}>Design notes <span aria-hidden="true">↗</span></a>
        </article>)}</div>
      </section>
      <section className="team-section page-width" id="collaborations" aria-labelledby="team-title">
        <div className="section-intro"><h2 id="team-title">Built together</h2><p>Team projects, with my contribution inside.</p></div>
        <div className="work-grid">{team.map(project => <WorkCard key={project.slug} project={project} number={project.slug === 'friday' ? 'HackMIT 2026' : 'ExecuTorch Hackathon SF'} />)}</div>
      </section>
      <section className="archive-section page-width" id="more-work" aria-labelledby="archive-title">
        <div className="section-intro"><h2 id="archive-title">More explorations</h2><p>Tools, interactions, and engineering coursework.</p></div>
        <div className="archive-list">{archive.map(project => <a className="archive-row" key={project.slug} href={projectHref(project)}><h3>{project.title}</h3><p>{project.summary}</p><span className="archive-category">{project.category}</span><span aria-hidden="true">↗</span></a>)}</div>
      </section>
      <section className="about-section page-width" id="about" aria-labelledby="about-title">
        <h2 id="about-title">A little about me</h2><div className="about-copy"><p className="about-lead">I like building things that make a tool easier to access or a process easier to understand.</p><p>I’m an Engineering Science student at the University of Toronto. CellScope started with the microscopes in my high school biology lab. WaferWatch grew from wanting a transparent view of the fabrication process.</p><p>My work moves between optics, hardware and software, with the requirements of the physical system connecting them.</p>
        <dl className="experience-list"><div><dt>University of Toronto</dt><dd>Engineering Science<span>Expected graduation · May 2029</span></dd></div><div><dt>McMaster University</dt><dd>Undergraduate photonics research<span>May 2026 – present</span></dd></div><div><dt>CellScope</dt><dd>Founder & optical systems engineer<span>July 2023 – present</span></dd></div></dl></div>
      </section>
      <section className="recognition-section page-width" aria-labelledby="recognition-title"><h2 id="recognition-title">A few milestones</h2><div className="recognition-list"><p><span>HackMIT 2026</span><span>Top 12 overall; 3rd place, OpenAI track</span></p><p><span>Schulich Leader Scholarship</span><span>2025</span></p><p><span>C. David Naylor University Scholarship</span><span>2025</span></p><p><span>Regeneron ISEF finalist</span><span>2024</span></p></div></section>
      <section className="scene-notes page-width" id="scene-notes" aria-labelledby="scene-notes-title"><h2 id="scene-notes-title">The scene on this page</h2><div><p>The homepage plays recorded outputs from my FSD project, using its existing meshes, filtered road surfaces, lighting and following camera. The approximately 20-second clip loops; interpolation smooths its roughly 2 Hz source observations.</p><p>This is a perception research visualization. Its visible misses and coarse surfaces are part of the output.</p><a className="text-link" href="#/projects/fsd">Read about the project</a><a className="text-link scene-credits" href={`${import.meta.env.BASE_URL}fsd/ATTRIBUTION.md`} target="_blank" rel="noreferrer">Scene sources and credits ↗</a></div></section>
      <footer className="contact-section page-width" id="contact"><div><p>Have something interesting in mind?</p><a className="email-link" href="mailto:willy.xu@mail.utoronto.ca">Let’s talk.<span aria-hidden="true">↗</span></a></div><nav aria-label="Social links"><a href="https://github.com/WilliamXu070" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/william-xu-willy/" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:willy.xu@mail.utoronto.ca">Email</a></nav><p className="footer-name">William Xu</p></footer>
    </main>
  </>;
}

export default function PortfolioExperiment() {
  const [hash, setHash] = useState(() => window.location.hash);
  const slug = hash.startsWith('#/projects/') ? hash.slice('#/projects/'.length) : null;
  const project = bySlug[slug];
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    document.title = project ? `${project.title} — William Xu` : 'William Xu — Optics, perception, and hardware';
    const frame = requestAnimationFrame(() => {
      if (slug) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('case-title')?.focus({ preventScroll: true });
      } else if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, project, slug]);
  if (slug && !project) return <main className="missing-page page-width"><h1 id="case-title" tabIndex="-1">Project not found</h1><a href="#projects">Return to all projects</a></main>;
  return project ? <ProjectPage project={project} nextProject={projects[(projects.indexOf(project) + 1) % projects.length]} /> : <HomePage />;
}
