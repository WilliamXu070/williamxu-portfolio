import { useEffect, useRef, useState } from 'react';

export default function FsdScene({ onAboutScene }) {
  const host = useRef(null), controller = useRef(null);
  const [status, setStatus] = useState('loading');
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('still'));
  useEffect(() => {
    let active = true;
    import('../scene/createFsdScene.js').then(({ createFsdScene }) => {
      if (!active) return;
      controller.current = createFsdScene(host.current, {
        paused: window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('still'),
        onReady: () => { if (active) setStatus('ready'); },
        onError: error => { if (active) { setStatus('fallback'); console.error('FSD portfolio scene:', error); } }
      });
    }).catch(error => { if (active) { setStatus('fallback'); console.error('FSD portfolio scene:', error); } });
    return () => { active = false; controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => { controller.current?.setPaused(paused); }, [paused]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = event => setPaused(event.matches);
    preference.addEventListener('change', change); return () => preference.removeEventListener('change', change);
  }, []);
  return <>
    <div className={`fsd-scene ${status === 'ready' ? 'is-ready' : ''}`} data-motion={paused ? 'paused' : 'playing'} aria-hidden="true">
      <img className="scene-poster" src={`${import.meta.env.BASE_URL}fsd/poster.jpg`} alt="" fetchPriority="high" />
      <div className="scene-canvas" ref={host} />
    </div>
    <p className="sr-only" role="status">{status === 'loading' ? 'Loading the recorded FSD scene.' : status === 'ready' ? 'Recorded FSD scene ready.' : 'Showing a still image of the FSD scene.'}</p>
    <div className="scene-controls">
      {onAboutScene ? <button type="button" onClick={onAboutScene}>About this scene</button> : <a href="#/projects/fsd">About this scene</a>}
      <button type="button" onClick={() => setPaused(value => !value)} disabled={status !== 'ready'} aria-pressed={paused} aria-label={paused ? 'Play scene' : 'Pause scene'}>{paused ? 'Play' : 'Pause'}<span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
    </div>
  </>;
}
