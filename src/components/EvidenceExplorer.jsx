import { useId, useRef, useState } from 'react';
import { inspections, inspectionFrames } from '../content/inspection.js';

const base = import.meta.env.BASE_URL;

export function EvidenceSource({ item }) {
  return <span className="evidence-source">
    {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source}</a> : item.source}
    {item.credit && <span className="evidence-credit"><a href={item.credit.url} target="_blank" rel="noreferrer">{item.credit.label}</a> · <a href={item.credit.licenseUrl} target="_blank" rel="noreferrer">{item.credit.license}</a></span>}
  </span>;
}

export default function EvidenceExplorer({ project, onReadDecision, featured = false }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [pointIndex, setPointIndex] = useState(null);
  const id = useId();
  const tabRefs = useRef([]);
  const frames = inspectionFrames(project);
  const config = inspections[project.slug] || { labels: [], points: [] };
  const item = frames[frameIndex];
  const point = frameIndex === 0 && pointIndex !== null ? config.points[pointIndex] : null;
  if (!item) return null;
  const selectFrame = index => { setFrameIndex(index); setPointIndex(null); };
  const moveTab = (event, index) => {
    const moves = { ArrowRight: (index + 1) % frames.length, ArrowLeft: (index + frames.length - 1) % frames.length, Home: 0, End: frames.length - 1 };
    if (Object.hasOwn(moves, event.key)) { event.preventDefault(); selectFrame(moves[event.key]); tabRefs.current[moves[event.key]]?.focus(); }
  };
  return <section className={`evidence-explorer explorer-${project.slug}${featured ? ' explorer-featured' : ''}`} aria-label={`Explore ${project.title} engineering evidence`}>
    <div className="explorer-toolbar"><span>{project.title} <span className="toolbar-secondary">/ {item.kind}</span></span><a href={`${base}${item.src}`} target="_blank" rel="noreferrer" aria-label={`Open full-size image: ${item.title}`}>Full-size image <span aria-hidden="true">↗</span></a></div>
    <div className="explorer-layout">
      <div className="explorer-visual" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${frameIndex}`}>
        <div className="explorer-image" style={{ aspectRatio: `${item.width} / ${item.height}`, '--image-ratio': item.width / item.height }}>
          <img src={`${base}${item.src}`} alt={item.alt} width={item.width} height={item.height} loading={featured ? 'eager' : 'lazy'} decoding="async" />
          {frameIndex === 0 && config.points.map((entry, i) => <button key={entry.label} className={`inspection-point${pointIndex === i ? ' is-selected' : ''}`} style={{ left: `${entry.x}%`, top: `${entry.y}%` }} aria-label={`Inspect ${entry.label}`} aria-pressed={pointIndex === i} aria-controls={`${id}-detail`} onClick={() => setPointIndex(pointIndex === i ? null : i)}><span aria-hidden="true">{pointIndex === i ? '−' : '+'}</span><span className="point-label">{entry.label}</span></button>)}
        </div>
      </div>
      <div className="explorer-detail" id={`${id}-detail`}>
        <div className="detail-story" aria-live="polite" aria-atomic="true"><p className="detail-type">{point ? 'Design decision' : item.kind}</p><h3>{point ? point.title : item.title}</h3><p>{point ? point.text : item.caption}</p></div>
        {frameIndex === 0 && config.points.length > 0 && <div className="part-selector" aria-label="Select a part to inspect">{config.points.map((entry, i) => <button key={entry.label} aria-pressed={pointIndex === i} onClick={() => setPointIndex(pointIndex === i ? null : i)}>{entry.label}<span aria-hidden="true">{pointIndex === i ? '−' : '+'}</span></button>)}</div>}
        {onReadDecision ? <button className="detail-link" onClick={() => onReadDecision(point ? point.section : -1)}>{point ? 'Read the design decision' : 'Read the project account'}</button> : <a className="detail-link" href={`#/projects/${project.slug}`}>Read the full project</a>}
        <EvidenceSource item={item} />
      </div>
    </div>
    <div className="explorer-tabs" role="tablist" aria-label={`${project.title} evidence views`}>{frames.map((frame, i) => <button key={frame.src} ref={element => { tabRefs.current[i] = element; }} id={`${id}-tab-${i}`} role="tab" aria-selected={frameIndex === i} aria-controls={`${id}-panel`} tabIndex={frameIndex === i ? 0 : -1} onKeyDown={event => moveTab(event, i)} onClick={() => selectFrame(i)}>{config.labels[i] || frame.title}</button>)}</div>
  </section>;
}
