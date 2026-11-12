// SEED DATA. Used as the starting content in local preview mode (no backend).
// Once the backend is connected, all of this comes from the API and is managed in /admin.
// Leader names are never stored here: the admin enters them.
import { positions } from './leadershipStructure.js';

export const departments = [
  { id: 1, slug: 'communication', name: 'Communication', icon: 'communication', short: 'Media and outreach', description: 'Telling our story through design, photography, video, social media and announcements so every student knows what God is doing on campus.', mission: 'To share the gospel and church news clearly, creatively and consistently.' },
  { id: 2, slug: 'youth', name: 'Youth', icon: 'youth', short: 'Young people in mission', description: 'Helping young people grow spiritually, mentally and socially, and serve their friends and community with their gifts.', mission: 'To lead young people into a saving relationship with Jesus and active service.' },
  { id: 3, slug: 'spiritual-evangelism', name: 'Spiritual & Evangelism', icon: 'evangelism', short: 'Word and witness', description: 'Bible study, prayer, mentorship and evangelistic outreach that strengthen believers and reach new friends.', mission: 'To nurture faith and win souls for Christ on campus.' },
  { id: 4, slug: 'education', name: 'Education', icon: 'education', short: 'Faith and learning', description: 'Supporting students in their studies through academic encouragement, Christian values and study fellowship.', mission: 'To help every student excel academically while growing in faith.' },
  { id: 5, slug: 'medical-missionary', name: 'Medical Missionary', icon: 'medical', short: 'Health and wellness', description: 'Health education, wellness campaigns and community service that care for the whole person.', mission: 'To bring healing and hope through health ministry.' },
  { id: 6, slug: 'religious-liberty', name: 'Religious Liberty', icon: 'liberty', short: 'Freedom of conscience', description: 'Defending and promoting freedom of conscience and worship on campus and beyond.', mission: 'To protect the freedom to believe and worship.' },
  { id: 7, slug: 'projects', name: 'Projects', icon: 'projects', short: 'Planning and development', description: 'Planning and running the fellowship\'s projects and fundraising so ministry plans become reality.', mission: 'To turn vision into well-managed projects that serve the mission.' },
  { id: 8, slug: 'possibility-ministry', name: 'Possibility Ministry', icon: 'possibility', short: 'Inclusion and care', description: 'Making sure members with special needs are included, supported and able to serve.', mission: 'To ensure every person belongs and can participate fully.' },
  { id: 9, slug: 'music', name: 'Music', icon: 'music', short: 'Choir and praise', description: 'Leading worship through the TNC-UDSM Choir, instrumentalists and praise teams.', mission: 'To lift God\'s name through excellent, reverent praise.' },
  { id: 10, slug: 'deacons', name: 'Deacons & Deaconesses', icon: 'deacons', short: 'Service and order', description: 'Serving the congregation, keeping order and caring for visitors and members.', mission: 'To serve with humility and welcome everyone warmly.' },
];

// Empty seats following the official 2026/2027 list. The admin fills in names, phones and photos.
export const leaders = positions
  .flatMap(([section, position, level, seats]) => Array.from({ length: seats }, () => ({ section, position, level })))
  .map((s, i) => ({ id: i + 1, order: i + 1, name: '', position: s.position, section: s.section, level: s.level, photo: null, phone: '', email: '', bio: '', published: true }));

export const events = []; // the admin adds events in /admin/events

export const sermons = [];
export const resources = [];
export const announcements = [];

export const gallery = [];

export const services = [
  { id: 1, name: 'Sabbath School', day: 'Saturday', time: '09:00 - 10:30', place: 'TNC Campus' },
  { id: 2, name: 'Divine Service', day: 'Saturday', time: '11:00 - 13:00', place: 'TNC Campus' },
  { id: 3, name: 'Midweek Prayer', day: 'Wednesday', time: '18:30 - 20:00', place: 'TNC Campus' },
];

// Members and families are created by people registering and by the admin: nothing is seeded.
export const members = [];
export const families = [];

// Sports activities and visitor requests are added/received later: nothing is seeded.
export const sports = [];
export const requests = [];
