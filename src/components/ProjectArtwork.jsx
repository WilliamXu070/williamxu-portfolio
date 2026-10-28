const base = import.meta.env.BASE_URL;

export default function ProjectArtwork({ project, eager = false }) {
  if (project.media) {
    const media = project.media;
    return <img className={`evidence-image media-${media.fit || 'contain'}`}
      src={`${base}${eager ? media.src : media.thumbnail}`}
      alt={media.alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
      width={media.width} height={media.height} />;
  }

  if (project.art === 'image' || project.art === 'fsd') {
    return <img src={`${base}${project.art === 'image' ? 'projects/cellscope.jpg' : 'fsd/poster.jpg'}`}
      alt={project.art === 'image' ? 'The physical CellScope microscope prototype' : 'Recorded camera-perception output with detected vehicles and reconstructed road surfaces'}
      loading={eager ? 'eager' : 'lazy'} width={project.art === 'image' ? 1200 : 1280} height={project.art === 'image' ? 900 : 720} />;
  }
  return <svg viewBox="0 0 680 430" role="img" aria-label={`${project.title}: ${project.flow.join(', ')}. Explanatory schematic.`}>
    <defs><pattern id={`grid-${project.slug}`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0v32" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".12" /></pattern><clipPath id={`disc-${project.slug}`}><circle cx="225" cy="205" r="124" /></clipPath></defs>
    <rect width="680" height="430" fill={`url(#grid-${project.slug})`} />
    {project.art === 'wafer' ? <g>
      <circle cx="225" cy="205" r="124" fill="#58625f" stroke="#a7b9b0" strokeWidth=".7" />
      <g clipPath={`url(#disc-${project.slug})`} fill="none" stroke="#b6c8be" strokeWidth=".7" opacity=".6">{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${100 + i * 23} 70v270M90 ${80 + i * 23}h270`} />)}</g>
      <path d="m210 81 15 15 15-15" fill="#282e30" /><rect x="227" y="196" width="23" height="23" fill="#d2dacf" />
      <g stroke="#b6c8be" strokeWidth="1" fill="none"><path d="M251 207h106l38-50h80M357 207l38 50h80M475 157v100" /><circle cx="395" cy="157" r="5" /><circle cx="395" cy="257" r="5" /><circle cx="475" cy="207" r="5" /></g>
      <g className="diagram-label"><text x="415" y="140">Process plan</text><text x="415" y="284">Execution history</text><text x="486" y="213">Evidence</text></g>
    </g> : project.art === 'waveguide' ? <g fill="none">
      <path d="M116 315h154c92 0 164-72 164-164V91" stroke="#4c5860" strokeWidth="52" /><path d="M116 315h154c92 0 164-72 164-164V91" stroke="#aabec4" strokeWidth="24" /><path d="M116 315h154c92 0 164-72 164-164V91" stroke="#d0e1e1" strokeWidth="1" strokeDasharray="5 8" />
      <path d="M494 315h82m-82-27h82m-73-5 12-24h40l12 24" stroke="#9cafb6" strokeWidth="1" />
      <g className="diagram-label"><text x="489" y="340">Etched ridge</text><text x="125" y="360">Input mode</text><text x="461" y="100">Output mode</text></g>
    </g> : project.art === 'stepper' ? <g>
      <path d="m125 152 205 32v72l-205 32Z" fill="#b9bbcf" fillOpacity=".12" /><path d="m350 184 175 36-175 36Z" fill="#b9bbcf" fillOpacity=".12" />
      <g fill="none" stroke="#b7b8c9" strokeWidth="1"><path d="m125 152 205 32M125 288l205-32M350 184l175 36-175 36" /><path d="M330 156q-20 64 0 128m20-128q20 64 0 128M516 178v84" /></g>
      <rect x="111" y="148" width="14" height="144" fill="#8b8e9e" /><rect x="506" y="263" width="70" height="7" fill="#8b8e9e" />
      <g className="diagram-label"><text x="91" y="330">DMD</text><text x="282" y="330">Reduction optics</text><text x="505" y="330">Wafer</text></g>
    </g> : project.art === 'phone' ? <g>
      <rect x="264" y="72" width="155" height="282" rx="19" fill="#30343a" stroke="#aebac4" /><path d="M313 89h55M312 337h57" stroke="#9ba8b4" strokeWidth="2" /><path d="M283 200h26l10-25 12 51 13-33 9 7h45" fill="none" stroke="#b8c7d5" strokeWidth="1.5" />
      <g fill="none" stroke="#91a0af" strokeWidth=".8"><circle cx="178" cy="208" r="30" /><path d="M208 208h56M419 208h62m0-22v44h49v-44zM288 268h107m-107 16h80" /></g>
      <g className="diagram-label"><text x="139" y="270">Wearable</text><text x="471" y="270">Local model</text></g>
    </g> : project.art === 'room' ? <g fill="none" stroke="#b6aba0" strokeWidth="1">
      <path d="m150 247 190-110 190 110-190 110Z" fill="#64584f" fillOpacity=".14" /><path d="M150 247V110l190-74 190 106v105M340 36v101" strokeOpacity=".55" /><path d="m258 243 76-44 89 51-75 44Z" fill="#8c7b6b" fillOpacity=".24" /><path d="M258 243v-36l76-44 89 51v36m-89-87v36m-76 8 90 51 75-44m-75 44v36" /><path d="m390 291 61-35 36 20-61 35Z" /><path d="M390 291v18m97-33v18m-61 17v18" />
      <g className="diagram-label"><text x="84" y="370">Reconstructed room</text><text x="442" y="370">Editable objects</text></g>
    </g> : <g>{project.flow.map((label, i) => <g key={label}>
      <circle cx={140 + i * 200} cy="205" r={i === 1 ? 47 : 28} fill="none" stroke="#b6b7c0" strokeWidth="1" />{i < 2 && <path d={`M${i === 0 ? 168 : 387} 205h125`} stroke="#858791" strokeWidth="1" strokeDasharray={i === 1 ? '3 6' : undefined} />}<text x={140 + i * 200} y="298" textAnchor="middle" className="diagram-label">{label}</text>
    </g>)}</g>}
  </svg>;
}
