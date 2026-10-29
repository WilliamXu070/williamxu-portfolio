import { useEffect, useState } from 'react';
import ProjectPage from './components/ProjectPage.jsx';
import HomeProjects from './components/HomeProjects.jsx';
import FsdScene from './components/FsdScene.jsx';
import projects from './content/projects.json';
import './portfolio.css';

const bySlug = Object.fromEntries(projects.map(project => [project.slug, project]));
const href = slug => `#/projects/${slug}`;

function HomePage() {
  return <>
    <a className="skip-link" href="#projects">Skip to projects</a>
    <main>
      <section className="portfolio-hero" id="home" aria-labelledby="name">
        <FsdScene />
        <div className="hero-shade" aria-hidden="true" />
        <nav className="main-nav" aria-label="Main navigation"><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="hero-intro"><h1 id="name">William Xu</h1><p>Optics, perception, and hardware.</p></div>
        <nav className="project-index" aria-label="Featured projects"><a href="#cellscope">CellScope</a><span aria-hidden="true" /><a href={href('fsd')}>FSD</a><span aria-hidden="true" /><a href="#waferwatch">WaferWatch</a></nav>
      </section>
      <HomeProjects />
      <section className="about-section page-width" id="about" aria-labelledby="about-title"><h2 id="about-title">A little about me.</h2><div className="about-copy"><p className="about-lead">My work moves between optics, hardware and software, with the requirements of the physical system connecting them.</p><p>I’m an Engineering Science student at the University of Toronto. CellScope started with the microscopes in my high school biology lab. WaferWatch grew from wanting a transparent view of the fabrication process.</p><dl className="experience-list"><div><dt>University of Toronto</dt><dd>Engineering Science<span>Expected graduation · May 2029</span></dd></div><div><dt>McMaster University</dt><dd>Undergraduate photonics research<span>May 2026 – present</span></dd></div><div><dt>CellScope</dt><dd>Founder & optical systems engineer<span>July 2023 – present</span></dd></div></dl></div></section>
      <section className="recognition-section page-width" aria-labelledby="recognition-title"><h2 id="recognition-title">Along the way.</h2><div className="recognition-list"><p><span>HackMIT 2026</span><span>Top 12 overall; 3rd place, OpenAI track</span></p><p><span>Schulich Leader Scholarship</span><span>2025</span></p><p><span>C. David Naylor University Scholarship</span><span>2025</span></p><p><span>Regeneron ISEF finalist</span><span>2024</span></p></div></section>
      <footer className="contact-section page-width" id="contact"><div><p>Have something interesting in mind?</p><a className="email-link" href="mailto:willy.xu@mail.utoronto.ca">Let’s talk.<span aria-hidden="true">↗</span></a></div><nav aria-label="Social links"><a href="https://github.com/WilliamXu070" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/william-xu-willy/" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:willy.xu@mail.utoronto.ca">Email</a></nav><p className="footer-name">William Xu · Optics, perception, and hardware.</p></footer>
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
      if (slug) { window.scrollTo({ top: 0, behavior: 'instant' }); document.getElementById('case-title')?.focus({ preventScroll: true }); }
      else if (hash) { document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }); }
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, project, slug]);
  if (slug && !project) return <main className="missing-page page-width"><h1 id="case-title" tabIndex="-1">Project not found</h1><a href="#projects">Return to all projects</a></main>;
  return project ? <ProjectPage key={slug} project={project} nextProject={projects[(projects.indexOf(project) + 1) % projects.length]} /> : <HomePage />;
}
