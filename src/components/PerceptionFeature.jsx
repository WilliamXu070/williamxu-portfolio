import { useRef, useState } from 'react';
import FsdScene from './FsdScene.jsx';

export default function PerceptionFeature({ onAboutScene }) {
  const [playing, setPlaying] = useState(false);
  const launchButton = useRef(null), closeButton = useRef(null);
  const openPlayback = () => { setPlaying(true); requestAnimationFrame(() => closeButton.current?.focus()); };
  const closePlayback = () => { setPlaying(false); requestAnimationFrame(() => launchButton.current?.focus()); };
  return <div className="perception-player">
    {playing ? <><FsdScene onAboutScene={onAboutScene} /><button ref={closeButton} className="scene-close" onClick={closePlayback}>Close playback <span aria-hidden="true">×</span></button></> : <><img className="perception-poster" src={`${import.meta.env.BASE_URL}fsd/poster.jpg`} alt="Recorded camera-perception output with vehicles and reconstructed road surfaces" width="1280" height="720" loading="lazy" /><button ref={launchButton} className="scene-launch" onClick={openPlayback}><span className="play-icon" aria-hidden="true">▷</span><span>Play recorded scene<small>Approximately 20 seconds · loops</small></span></button></>}
  </div>;
}
