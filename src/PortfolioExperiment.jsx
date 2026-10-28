import { useEffect, useState } from 'react';
import ProjectPage from './components/ProjectPage.jsx';
import EvidenceExplorer from './components/EvidenceExplorer.jsx';
import PerceptionFeature from './components/PerceptionFeature.jsx';
import projects from './content/projects.json';
import './portfolio.css';

const base = import.meta.env.BASE_URL;
const bySlug = Object.fromEntries(projects.map(project => [project.slug, project]));
const remaining = ['hackerfab', 'halo', 'laser-driver', 'jungle', 'looky', 'bifrost', 'wicker', 'astronomy', 'can-opening', 'newmux', 'framegen'].map(slug => bySlug[slug]);
const href = slug => `#/projects/${slug}`;

function ProjectTile({ slug, title, note }) {
  const project = bySlug[slug];
  return <article className={`gallery-project gallery-${slug}`} id={slug}>
    <a className="gallery-image" href={href(slug)} aria-label={`Explore ${project.title}`}>
      <img src={`${base}${project.media.src}`} alt={project.media.alt} width={project.media.width} height={project.media.height} loading="lazy" decoding="async" />
      <span className="image-action">Explore project <span aria-hidden="true">↗</span></span>
    </a>
    <div className="gallery-caption"><div><h3><a href={href(slug)}>{project.title}</a></h3><p>{title}</p></div><span>{note}</span></div>
  </article>;
}

function HomePage() {
  return <>
    <a className="skip-link" href="#projects">Skip to projects</a>
    <header className="site-header page-width" id="home"><a className="wordmark" href="#home">William Xu<span>Engineering Science, University of Toronto</span></a><nav aria-label="Main navigation"><a href="#projects">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header>
    <main>
      <section className="home-intro page-width" aria-labelledby="intro-title"><h1 id="intro-title">Optics. Hardware.<br />Software.</h1><div><p>I like building things that make a tool easier to access or a process easier to understand.</p><a className="quiet-link" href="#projects">Explore my work <span aria-hidden="true">↓</span></a></div></section>
      <section className="selected-work page-width" id="projects" aria-labelledby="selected-title">
        <div className="section-line"><h2 id="selected-title">Selected work</h2><span>From the physical system to the software around it.</span></div>
        <article className="cellscope-feature" id="cellscope"><div className="feature-heading"><div><h2>CellScope</h2><p>Microscopy on a cellphone.</p></div><p className="feature-ownership">Founder & optical systems engineer<span>Research prototype · ISEF 2024</span></p></div>
          <EvidenceExplorer project={bySlug.cellscope} featured />
          <div className="feature-result"><p><strong>2.2 µm</strong> reported resolution</p><p><strong>2.01 mm²</strong> field of view</p><p><strong>0.6 s</strong> dataset acquisition</p><a href={href('cellscope')}>The optics, the decisions, the results <span aria-hidden="true">↗</span></a></div>
        </article>
        <div className="project-gallery">
          <ProjectTile slug="friday" title="A room the agent can understand." note="3D environment lead · HackMIT 2026" />
          <ProjectTile slug="waferwatch" title="Make the fabrication history visible." note="Concept to implementation" />
        </div>
        <p className="gallery-context">FRIDAY shows a licensed demo apartment. WaferWatch shows its earlier prototype. Each project contains the original sources and development context.</p>
        <article className="photonics-feature" id="photonics"><a className="photonics-image" href={href('photonics')} aria-label="Explore lithium niobate photonics"><img src={`${base}${bySlug.photonics.media.src}`} alt={bySlug.photonics.media.alt} width="2200" height="1100" loading="lazy" decoding="async" /><span className="image-action">Inspect the geometry <span aria-hidden="true">↗</span></span></a><div className="photonics-copy"><p className="project-domain">Photonic devices</p><h2>Designing for the<br />way light behaves.</h2><p>{bySlug.photonics.summary}</p><p className="project-context">Lithium niobate bend research at McMaster. Archived geometry and simulation diagnostics, with the fabrication assumptions made explicit.</p><a className="quiet-link" href={href('photonics')}>Explore the research <span aria-hidden="true">↗</span></a></div></article>
      </section>
      <section className="perception-section" id="fsd" aria-labelledby="perception-title"><div className="perception-intro page-width"><div><p className="project-domain">Camera perception</p><h2 id="perception-title">From observations<br />to a spatial scene.</h2></div><p>{bySlug.fsd.summary}</p></div><div className="page-width"><PerceptionFeature /><div className="perception-caption"><p>Recorded research output. Visible misses and coarse road surfaces are part of the result.</p><a href={href('fsd')}>Explore the experiments <span aria-hidden="true">↗</span></a></div></div></section>
      <section className="more-work page-width" id="more-work" aria-labelledby="more-title"><div className="section-line"><h2 id="more-title">More of my work</h2><span>Hardware, tools, and collaborative builds.</span></div><div className="project-directory">{remaining.map(project => <a className="directory-row" key={project.slug} href={href(project.slug)}><h3>{project.title}</h3><p>{project.summary}</p><span>{project.status}</span><span aria-hidden="true">↗</span></a>)}</div></section>
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
