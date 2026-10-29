import ProjectArtwork from './ProjectArtwork.jsx';
import EvidenceExplorer from './EvidenceExplorer.jsx';
import PerceptionFeature from './PerceptionFeature.jsx';

const base = import.meta.env.BASE_URL;

function Prose({ text }) {
  return <p>{text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>;
}

export default function ProjectPage({ project, nextProject }) {
  const sections = [{ title: 'The starting point', id: 'starting-point' }, ...project.sections.map((section, i) => ({ title: section.title, id: `decision-${i}` }))];
  const goToSection = id => {
    const heading = document.getElementById(id);
    heading?.scrollIntoView({ behavior: 'instant' });
    heading?.focus({ preventScroll: true });
  };
  return <>
    <a className="skip-link" href="#/projects/" onClick={event => { event.preventDefault(); goToSection('starting-point'); }}>Skip to project account</a>
    <header className="site-header page-width"><a className="wordmark" href="#home">William Xu</a><nav aria-label="Project navigation"><a href="#projects">All work</a><a href="#contact">Contact</a></nav></header>
    <main id="project-page" className="case-page" aria-labelledby="case-title">
      <header className="case-heading page-width"><div><p className="project-domain">{project.category}</p><h1 id="case-title" tabIndex="-1">{project.title}</h1><p className="case-summary">{project.summary}</p></div><dl className="case-meta"><div><dt>My contribution</dt><dd>{project.role}</dd></div><div><dt>Project stage</dt><dd>{project.status}</dd></div></dl></header>
      <div className="page-width case-explorer">{project.media ? <EvidenceExplorer project={project} onReadDecision={index => goToSection(index < 0 ? 'starting-point' : `decision-${index}`)} /> : project.slug === 'fsd' ? <><PerceptionFeature onAboutScene={() => goToSection('scene-notes')} /><p className="case-visual-note">Recorded research output. Playback interpolates roughly 2 Hz source observations; its smoothness is separate from inference speed.</p></> : <figure className="case-schematic"><ProjectArtwork project={project} eager /><figcaption>Explanatory system schematic. This is not a prototype photograph or a simulation result.</figcaption></figure>}</div>
      <div className="case-body page-width"><aside className="case-aside"><div className="case-aside-sticky"><p>Inside the project</p><nav aria-label="Project sections">{sections.map(section => <button key={section.id} onClick={() => goToSection(section.id)}>{section.title}</button>)}</nav>{project.links.length > 0 && <nav className="source-links" aria-label="Project sources"><p>Original sources</p>{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</nav>}</div></aside>
        <div className="case-prose"><section aria-labelledby="starting-point"><h2 id="starting-point" tabIndex="-1">The starting point</h2>{project.intro.map(text => <Prose key={text} text={text} />)}</section>{project.sections.map((section, i) => <section key={section.title} aria-labelledby={`decision-${i}`}><h2 id={`decision-${i}`} tabIndex="-1">{section.title}</h2>{section.paragraphs.map(text => <Prose key={text} text={text} />)}</section>)}{project.slug === 'fsd' && <section><h2 id="scene-notes" tabIndex="-1">About the recorded scene</h2><p>The approximately 20-second clip uses the project’s existing meshes, filtered road surfaces, lighting and following camera. Interpolation smooths the source observations. Visible misses and coarse surfaces are part of the research output.</p><a className="quiet-link" href={`${base}fsd/ATTRIBUTION.md`} target="_blank" rel="noreferrer">Scene sources and asset credits</a></section>}</div>
      </div>
      <a className="next-project page-width" href={`#/projects/${nextProject.slug}`}><span>Next project</span><div>{nextProject.title}<span aria-hidden="true">↗</span></div></a>
    </main><footer className="case-footer page-width"><a href="#projects">Back to all work</a><a href="mailto:willy.xu@mail.utoronto.ca">willy.xu@mail.utoronto.ca</a></footer>
  </>;
}
