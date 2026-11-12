// Describes every thing the admin can manage. Adding a new content type = add an entry here
// (and the matching list under /manage/<key>/ in the backend).
import { LuUsers, LuUsersRound, LuHouse, LuCalendarDays, LuMic, LuMegaphone, LuLibrary, LuImage, LuClock, LuHeartHandshake, LuTrophy, LuInbox } from 'react-icons/lu';
import { sections } from '../data/leadershipStructure.js';
import { iconOptions } from '../lib/icons.jsx';

const sectionOptions = sections.map((s) => [s.key, s.label]);
export const sectionLabel = (key) => sections.find((s) => s.key === key)?.label || key;

export const REQUEST_TYPES = { 'bible-study': 'Bible study', prayer: 'Prayer request', message: 'Message' };

export const RESOURCES = {
  // members and families have their own screens (MembersAdmin, FamiliesAdmin); listed here for navigation and dashboard counts
  members: { label: 'Members', singular: 'Member', icon: LuUsersRound, custom: true },
  families: { label: 'Families', singular: 'Family', icon: LuHouse, custom: true },
  leaders: {
    label: 'Leaders', singular: 'Leader', icon: LuUsers,
    description: 'Names, photos and contacts shown on the Leadership and Ministries pages.',
    canCreate: true, canDelete: true, sort: (a, b) => (a.order ?? 0) - (b.order ?? 0),
    filter: { field: 'section', label: 'All sections', options: sectionOptions },
    title: (r) => r.name || 'Not yet entered', subtitle: (r) => r.position, imageKey: 'photo',
    columns: [
      { label: 'Section', render: (r) => sectionLabel(r.section) },
      { label: 'Phone', render: (r) => r.phone || '-' },
      { label: 'Status', status: (r) => (!r.name ? 'Needs name' : r.published === false ? 'Hidden' : 'Published') },
    ],
    fields: [
      { name: 'name', label: 'Full name', type: 'text', hint: 'Leave empty if the seat is not filled yet. Empty seats are not shown on the website.' },
      { name: 'position', label: 'Position', type: 'text', required: true },
      { name: 'section', label: 'Section', type: 'select', options: sectionOptions, required: true },
      { name: 'level', label: 'Level', type: 'select', options: [['head', 'Head'], ['deputy', 'Deputy'], ['member', 'Member']], required: true },
      { name: 'order', label: 'Display order', type: 'number', hint: 'Smaller numbers appear first.' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'bio', label: 'Short bio', type: 'textarea', wide: true },
      { name: 'photo', label: 'Photo', type: 'image', wide: true },
      { name: 'published', label: 'Show on the website', type: 'checkbox', wide: true },
    ],
    blank: { name: '', position: '', section: 'executive', level: 'member', phone: '', email: '', bio: '', photo: null, published: true },
  },
  events: {
    label: 'Events', singular: 'Event', icon: LuCalendarDays,
    description: 'Concerts, programmes and special services. Past events move to "Past events" automatically.',
    canCreate: true, canDelete: true, sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    title: (r) => r.title, subtitle: (r) => r.location, imageKey: 'image',
    columns: [
      { label: 'Date', render: (r) => r.date },
      { label: 'Time', render: (r) => r.time },
    ],
    fields: [
      { name: 'title', label: 'Event title', type: 'text', required: true, wide: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'text', placeholder: '16:00 - 21:00', required: true },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'Music' },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'image', label: 'Poster or photo', type: 'image', wide: true },
    ],
    blank: { title: '', date: '', time: '', department: '', location: '', description: '', image: null },
  },
  sermons: {
    label: 'Sermons', singular: 'Sermon', icon: LuMic,
    description: 'Messages people can listen to or watch.',
    canCreate: true, canDelete: true, sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    title: (r) => r.title, subtitle: (r) => r.speaker,
    columns: [
      { label: 'Series', render: (r) => r.series || '-' },
      { label: 'Date', render: (r) => r.date },
    ],
    fields: [
      { name: 'title', label: 'Sermon title', type: 'text', required: true, wide: true },
      { name: 'speaker', label: 'Speaker', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'series', label: 'Series', type: 'text' },
      { name: 'url', label: 'Link (YouTube, audio, etc.)', type: 'url', required: true, wide: true },
    ],
    blank: { title: '', speaker: '', date: '', series: '', url: '' },
  },
  announcements: {
    label: 'Announcements', singular: 'Announcement', icon: LuMegaphone,
    description: 'Short notices shown on the home page notice board.',
    canCreate: true, canDelete: true, sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    title: (r) => r.title, subtitle: (r) => r.text,
    columns: [{ label: 'Date', render: (r) => r.date }],
    fields: [
      { name: 'title', label: 'Headline', type: 'text', required: true, wide: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'text', label: 'Message', type: 'textarea', required: true, wide: true },
    ],
    blank: { title: '', date: '', text: '' },
  },
  resources: {
    label: 'Resources', singular: 'Resource', icon: LuLibrary,
    description: 'Readings, study guides, music and health material.',
    canCreate: true, canDelete: true,
    title: (r) => r.title, subtitle: (r) => r.url,
    columns: [{ label: 'Type', render: (r) => r.type }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'type', label: 'Type', type: 'select', options: [['Reading', 'Reading'], ['Study', 'Study'], ['Music', 'Music'], ['Health', 'Health'], ['Other', 'Other']], required: true },
      { name: 'url', label: 'Link', type: 'url', required: true, wide: true },
    ],
    blank: { title: '', type: 'Reading', url: '' },
  },
  gallery: {
    label: 'Gallery', singular: 'Photo', icon: LuImage,
    description: 'Photos shown on the Gallery page.',
    canCreate: true, canDelete: true,
    title: (r) => r.caption, imageKey: 'src',
    columns: [],
    fields: [
      { name: 'caption', label: 'Caption', type: 'text', required: true, wide: true },
      { name: 'src', label: 'Photo', type: 'image', required: true, wide: true },
    ],
    blank: { caption: '', src: null },
  },
  services: {
    label: 'Worship times', singular: 'Service', icon: LuClock,
    description: 'Weekly services shown at the top of the home page.',
    canCreate: true, canDelete: true,
    title: (r) => r.name, subtitle: (r) => r.place,
    columns: [{ label: 'Day', render: (r) => r.day }, { label: 'Time', render: (r) => r.time }],
    fields: [
      { name: 'name', label: 'Service name', type: 'text', required: true, wide: true },
      { name: 'day', label: 'Day', type: 'select', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => [d, d]), required: true },
      { name: 'time', label: 'Time', type: 'text', placeholder: '09:00 - 10:30', required: true },
      { name: 'place', label: 'Place', type: 'text', required: true, wide: true },
    ],
    blank: { name: '', day: 'Saturday', time: '', place: 'TNC Campus' },
  },
  sports: {
    label: 'Sports & Recreation', singular: 'Activity', icon: LuTrophy,
    description: 'Sports, games and recreation activities shown on the Sports & Recreation page.',
    canCreate: true, canDelete: true,
    title: (r) => r.name, subtitle: (r) => r.venue,
    columns: [{ label: 'Day', render: (r) => r.day }, { label: 'Time', render: (r) => r.time || '-' }],
    fields: [
      { name: 'name', label: 'Activity', type: 'text', required: true, wide: true, placeholder: 'Football, Netball, Volleyball...' },
      { name: 'day', label: 'Day', type: 'select', options: ['Various', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => [d, d]), required: true },
      { name: 'time', label: 'Time', type: 'text', placeholder: '16:00 - 18:00' },
      { name: 'venue', label: 'Venue', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
    ],
    blank: { name: '', day: 'Various', time: '', venue: '', description: '' },
  },
  requests: {
    label: 'Requests & messages', singular: 'Request', icon: LuInbox,
    description: 'Bible study requests, prayer requests and messages sent from the website. Only administrators can see these. Mark each one as you follow it up.',
    canCreate: false, canDelete: true, sort: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)),
    title: (r) => r.name || 'Anonymous', subtitle: (r) => (r.message || '').slice(0, 80),
    columns: [
      { label: 'Type', render: (r) => REQUEST_TYPES[r.type] || r.type },
      { label: 'Received', render: (r) => String(r.createdAt || '').slice(0, 10) },
      { label: 'Status', status: (r) => r.status || 'New' },
    ],
    fields: [
      { name: 'status', label: 'Status', type: 'select', options: [['New', 'New'], ['In progress', 'In progress'], ['Done', 'Done']], required: true },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'topic', label: 'Topic', type: 'text' },
      { name: 'preferred', label: 'Preferred day / time', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea', wide: true },
    ],
    blank: {},
  },
  departments: {
    label: 'Ministries', singular: 'Ministry', icon: LuHeartHandshake,
    description: 'The descriptions shown on the Ministries pages. Ministries match the leadership sections, so they cannot be added or removed here.',
    canCreate: false, canDelete: false,
    title: (r) => r.name, subtitle: (r) => r.short,
    columns: [],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'short', label: 'Tagline', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: iconOptions, required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, wide: true },
      { name: 'mission', label: 'Mission', type: 'textarea', wide: true },
    ],
    blank: {},
  },
};

export const NAV_GROUPS = [
  { label: 'Members', keys: ['members', 'families'] },
  { label: 'People', keys: ['leaders', 'departments'] },
  { label: 'Programmes', keys: ['events', 'services', 'sermons', 'sports'] },
  { label: 'Content', keys: ['announcements', 'resources', 'gallery'] },
  { label: 'Inbox', keys: ['requests'] },
];
