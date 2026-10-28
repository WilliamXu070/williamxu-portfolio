// Positions are relative to each unaltered source image, not the viewport.
export const inspections = {
  cellscope: {
    labels: ['Instrument', 'Acquisition', 'Resolution', 'Field of view'],
    points: [
      { label: 'Phone & optics', x: 29, y: 32, title: 'Start with a camera people already own.', text: 'I combined a cellphone with compact optics and Fourier ptychography. The phone provides the camera, display and computing platform; reconstruction extends the information collected under different illumination angles.', section: 0 },
      { label: 'Sample', x: 59, y: 34, title: 'The mechanics are part of the optical system.', text: 'Focus, alignment and stability have to hold across the image sequence. In the later mechanical iteration, the phone and optics stay stationary while the lightweight sample stage moves for focus.', section: 0 },
      { label: 'Illumination', x: 56, y: 59, title: 'Change the light. Recover more information.', text: 'The programmable array illuminates the sample from different angles. Those measurements supply different spatial-frequency information to the reconstruction, so illumination geometry and acquisition consistency matter.', section: 0 }
    ]
  },
  friday: {
    labels: ['Room editor', 'Sandbox checkout'],
    points: [
      { label: 'Room geometry', x: 68, y: 42, title: 'An environment the agent can reason about.', text: 'I led the 3D environment development and worked on adapting visual odometry for accessible room scanning. Dimensions, orientation and support relationships matter for placement. This image uses the credited demo apartment; phone-video capture remained experimental.', section: 0 },
      { label: 'Design constraints', x: 18, y: 32, title: 'Make the requirements explicit.', text: 'I helped constrain the agent and its domain-specific language. Budget, materials, dimensions and relationships between objects become validated constraints; scene changes are checked before they are committed.', section: 1 },
      { label: 'Editable furniture', x: 52, y: 65, title: 'Connect the room to real product identities.', text: 'I contributed to the catalogue, UI and commerce path. Product identity stays connected from the 3D model to the chosen design and cart. The separate checkout recording shows a Visa sandbox request.', section: 2 }
    ]
  },
  waferwatch: {
    labels: ['Earlier prototype'],
    points: [
      { label: 'Wafer & dies', x: 35, y: 49, title: 'Follow one part through the process.', text: 'I conceived and built WaferWatch to make the fabrication chain accessible and transparent. This earlier visualizer connects a wafer to individual dies. The later application extends that idea into process plans and individual execution histories.', section: 0 },
      { label: 'Process state', x: 71, y: 25, title: 'A status needs a history behind it.', text: 'In the later application, I separated the intended process from its actual execution. Repeated steps receive linked identities, and corrections supersede earlier evidence instead of erasing it. This screenshot predates that process-history interface.', section: 0 }
    ]
  },
  photonics: {
    labels: ['Geometry', 'Polygon joins', 'Curvature', 'Reference check'],
    points: [
      { label: 'Bend geometry', x: 32, y: 69, title: 'A geometry tied to a fabrication platform.', text: 'My bend workflow makes material orientation, etch profile and waveguide dimensions explicit. This archived geometry uses an earlier configuration. The current fabrication stack is documented separately in the design account below.', section: 0 },
      { label: 'Source & monitor', x: 87, y: 29, title: 'Hold the comparison conditions consistent.', text: 'Ports, modes, normalization, mesh and boundaries need to agree between the baseline and candidate. The source and monitor shown here define the study geometry; the image does not demonstrate an optical performance gain.', section: 1 }
    ]
  },
  hackerfab: { labels: ['Optical paths', 'Objective proxy', 'Spot evaluation'], points: [] },
  halo: { labels: ['Model-loading implementation'], points: [] },
  'laser-driver': { labels: ['Requirements', 'Control & protection'], points: [] },
  bifrost: { labels: ['Load test', 'Cut layout', 'Cross-section', 'Failure'], points: [] },
  'can-opening': { labels: ['Morphology', 'Mechanism'], points: [] },
  jungle: { labels: ['Approval queue'], points: [] },
  looky: { labels: ['STEP fixture', '3MF fixture'], points: [] }
};

export function inspectionFrames(project) {
  return [project.media, ...(project.evidence || [])].filter(Boolean).filter((item, index, items) => items.findIndex(other => other.src === item.src) === index);
}
