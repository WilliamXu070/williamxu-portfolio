import ProjectArtwork from './ProjectArtwork.jsx';

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
    <header className="case-nav page-width"><a className="wordmark" href="#home">William Xu</a><nav aria-label="Project navigation"><a href="#projects">All projects</a><a href="#contact">Contact</a></nav></header>
    <main id="project-page" className="case-page" aria-labelledby="case-title">
      <header className="case-heading page-width"><p className="case-category">{project.category}</p><h1 id="case-title" tabIndex="-1">{project.title}</h1><p className="case-summary">{project.summary}</p><dl className="case-meta"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Stage</dt><dd>{project.status}</dd></div></dl></header>
      <figure className={`case-figure page-width art-${project.art}`}><div className="case-art"><ProjectArtwork project={project} eager /></div><figcaption>{project.art === 'image' ? 'Physical CellScope prototype, from the project presentation.' : project.art === 'fsd' ? 'Recorded research output from the same project that animates the homepage. Playback smoothness is separate from model inference speed.' : 'System schematic to explain the project; this is not a prototype photograph or a simulation result.'}</figcaption></figure>
      <div className="case-body page-width">
        <aside className="case-aside"><p>Inside the project</p><ol>{sections.map(section => <li key={section.id}><button onClick={() => goToSection(section.id)}>{section.title}</button></li>)}</ol>{project.links.length > 0 && <nav aria-label="Project evidence"><p>Project evidence</p>{project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</nav>}</aside>
        <div className="case-prose"><section aria-labelledby="starting-point"><h2 id="starting-point" tabIndex="-1">The starting point</h2>{project.intro.map(text => <Prose key={text} text={text} />)}</section>{project.sections.map((section, i) => <section key={section.title} aria-labelledby={`decision-${i}`}><h2 id={`decision-${i}`} tabIndex="-1">{section.title}</h2>{section.paragraphs.map(text => <Prose key={text} text={text} />)}</section>)}{project.slug === 'fsd' && <p className="source-note"><a href={`${import.meta.env.BASE_URL}fsd/ATTRIBUTION.md`} target="_blank" rel="noreferrer">Scene sources and asset credits</a></p>}</div>
      </div>
      <a className="next-project page-width" href={`#/projects/${nextProject.slug}`}><span>Next project</span><div>{nextProject.title}<span aria-hidden="true">↗</span></div></a>
    </main>
    <footer className="case-footer page-width"><a href="#projects">Back to all projects</a><a href="mailto:willy.xu@mail.utoronto.ca">willy.xu@mail.utoronto.ca</a></footer>
  </>;
}
