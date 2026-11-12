// Main navigation, following the hand-drawn layout:
// Home | About | News & Announcements | Events | Community v | More v | (user icon)
// Every destination of the official site structure stays one click or one hover away.
export const NAV = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/about' },
  { label: 'News & Announcements', to: '/news' },
  { label: 'Events', to: '/events' },
  {
    label: 'Community',
    children: [
      { label: 'Family & Prayer Groups', to: '/families' },
      { label: 'Sports & Recreation', to: '/sports' },
      { label: 'Alumni', to: '/alumni' },
    ],
  },
  {
    label: 'More',
    children: [
      { label: 'Ministries', to: '/departments' },
      { label: 'TNC Choir', to: '/choir' },
      { label: 'Leadership', to: '/leadership' },
      { label: 'Memories & Gallery', to: '/gallery' },
      { label: 'Sermons', to: '/sermons' },
      { label: 'TNC Library', to: '/library' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];
// "My Profile" lives behind the user icon (Member Login when signed out).
