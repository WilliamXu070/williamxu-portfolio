import projects from '../content/projects.json';
import '../home-projects.css';

const base = import.meta.env.BASE_URL;
const bySlug = Object.fromEntries(projects.map(project => [project.slug, project]));
const href = slug => `#/projects/${slug}`;
const archive = ['halo', 'fsd', 'laser-driver', 'jungle', 'looky', 'bifrost', 'astronomy', 'can-opening', 'wicker', 'newmux', 'framegen'];

function ProjectImage({ slug, className = '' }) {
  const { title, media } = bySlug[slug];
  return <a className={`work-image ${className}`} href={href(slug)} aria-label={`Explore ${title}`}>
    <img src={`${base}${media.src}`} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
    <span className="work-image-link" aria-hidden="true">View project ↗</span>
  </a>;
}

function ProjectCaption({ slug, title, discipline, children, note }) {
  return <div className="work-caption">
    <p className="work-discipline">{discipline}</p>
    <h3><a href={href(slug)}>{title || bySlug[slug].title}<span aria-hidden="true">↗</span></a></h3>
    <p className="work-description">{children}</p>
    {note && <p className="work-note">{note}</p>}
  </div>;
}

export default function HomeProjects() {
  return <>
    <section className="work-selection" id="projects" aria-labelledby="work-title">
      <header className="work-intro work-width">
        <h2 id="work-title">Selected projects</h2>
        <p>Things I’ve built, tested,<br />and worked to understand.</p>
        <a href="#more-work">Browse all work <span aria-hidden="true">↓</span></a>
      </header>

      <div className="work-pair work-pair-optics work-width">
        <article className="work-cellscope" id="cellscope">
          <ProjectImage slug="cellscope" />
          <ProjectCaption slug="cellscope" discipline="Optical systems · Founder" note="Research prototype · Regeneron ISEF 2024">
            I built a cellphone microscope, from the illumination and imaging optics to the reconstructed image.
          </ProjectCaption>
          <dl className="work-measurements">
            <div><dt>2.2 µm</dt><dd>Reported resolution</dd></div>
            <div><dt>2.01 mm²</dt><dd>Field of view</dd></div>
            <div><dt>0.6 s</dt><dd>Dataset acquisition</dd></div>
          </dl>
        </article>
        <article className="work-photonics" id="photonics">
          <ProjectImage slug="photonics" />
          <ProjectCaption slug="photonics" title="Photonic waveguides" discipline="Photonics · McMaster research" note="Archived waveguide geometry; simulation work in progress.">
            Designing lithium niobate waveguide bends around the constraints of a real fabrication process.
          </ProjectCaption>
        </article>
      </div>

      <article className="work-friday work-width" id="friday">
        <header className="work-friday-heading"><h3><a href={href('friday')}>FRIDAY<span aria-hidden="true">↗</span></a></h3><p>A room the agent<br />can understand.</p></header>
        <ProjectImage slug="friday" />
        <div className="work-friday-caption">
          <p className="work-discipline">Spatial computing · Team project<span>HackMIT 2026 · Top 12 overall</span></p>
          <p>I led the 3D environment and visual-odometry integration, and helped define the agent’s constraints, interface and commerce path.</p>
        </div>
        <p className="work-note">Demo room: <a href="https://superspl.at/scene/4de797f4" target="_blank" rel="noreferrer">Haussmann Apartment</a> by Stéphane Agullo (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>). Experimental room capture is documented in the case study.</p>
      </article>

      <div className="work-pair work-pair-fabrication work-width">
        <article className="work-waferwatch" id="waferwatch">
          <ProjectImage slug="waferwatch" />
          <ProjectCaption slug="waferwatch" discipline="Semiconductor tooling · Concept & implementation" note="Earlier working prototype shown.">
            I wanted to trace a fabrication result back through every step that produced it, so I built a way to make that history visible.
          </ProjectCaption>
        </article>
        <article className="work-hackerfab" id="hackerfab">
          <ProjectImage slug="hackerfab" />
          <ProjectCaption slug="hackerfab" discipline="Lithography · Design & refactoring" note="Native Zemax study using a published objective prescription as a proxy.">
            Working through the exposure, imaging and motion requirements of maskless lithography.
          </ProjectCaption>
        </article>
      </div>
    </section>

    <section className="work-archive work-width" id="more-work" aria-labelledby="archive-title">
      <header className="work-archive-heading"><h2 id="archive-title">Other projects</h2><p>Experiments, tools, and collaborative builds.</p></header>
      <div className="work-archive-grid">{archive.map(slug => {
        const project = bySlug[slug];
        return <a className={`work-archive-entry ${project.media ? 'has-image' : ''}`} key={slug} href={href(slug)}>
          {project.media && <img src={`${base}${project.media.thumbnail}`} alt="" width={project.media.width} height={project.media.height} loading="lazy" decoding="async" />}
          <div><p className="work-discipline">{project.status}</p><h3>{project.title}</h3><p className="work-archive-summary">{project.summary}</p></div>
          <span className="work-archive-arrow" aria-hidden="true">↗</span>
        </a>;
      })}</div>
    </section>
  </>;
}
