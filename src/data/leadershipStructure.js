// STRUCTURE ONLY (section order + labels), taken from the TNC 2026/2027 leadership list.
// No leader names live in the frontend: names, phones and photos are entered by the admin
// in the backend admin panel and arrive through api.getLeaders().
export const sections = [
  { key: 'executive', label: 'Executive Committee' },
  { key: 'communication', label: 'Communication' },
  { key: 'youth', label: 'Youth' },
  { key: 'spiritual-evangelism', label: 'Spiritual & Evangelism' },
  { key: 'education', label: 'Education' },
  { key: 'medical-missionary', label: 'Medical Missionary' },
  { key: 'religious-liberty', label: 'Religious Liberty' },
  { key: 'projects', label: 'Projects' },
  { key: 'possibility-ministry', label: 'Possibility Ministry' },
  { key: 'music', label: 'Music' },
  { key: 'deacons', label: 'Deacons & Deaconesses' },
];

// [section, position title, level, how many seats]  - level: head | deputy | member
export const positions = [
  ['executive', 'Chairperson', 'head', 1],
  ['executive', 'Deputy Chairperson', 'deputy', 3],
  ['executive', 'Executive Secretary', 'head', 1],
  ['executive', 'Deputy Secretary', 'deputy', 3],
  ['executive', 'Chief Treasurer', 'head', 1],
  ['executive', 'Assistant Treasurer', 'deputy', 1],
  ['executive', 'Internal Auditor', 'head', 1],
  ['communication', 'Communication Coordinator', 'head', 1],
  ['communication', 'Deputy Communication Coordinator', 'deputy', 1],
  ['youth', 'Youth Coordinator', 'head', 1],
  ['spiritual-evangelism', 'Spiritual & Evangelism Coordinator', 'head', 1],
  ['spiritual-evangelism', 'Deputy Spiritual & Evangelism Coordinator', 'deputy', 1],
  ['education', 'Education Leader', 'head', 1],
  ['medical-missionary', 'Medical Missionary Coordinator', 'head', 1],
  ['religious-liberty', 'Religious Liberty Coordinator', 'head', 1],
  ['projects', 'Project Manager', 'head', 1],
  ['projects', 'Assistant Project Manager', 'deputy', 1],
  ['possibility-ministry', 'Possibility Ministry Coordinator', 'head', 1],
  ['music', 'Music Coordinator', 'head', 1],
  ['deacons', 'Chief Deacon', 'head', 1],
  ['deacons', 'Chief Deaconess', 'head', 1],
  ['deacons', 'Deacon', 'member', 2],
  ['deacons', 'Deaconess', 'member', 2],
];
