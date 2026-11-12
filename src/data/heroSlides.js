// HOME HERO SLIDER - edit this list to change the slides.
// Photos live in public/images/hero/ (use src: '/images/hero/your-file.jpg').
// Keep slides evergreen (welcome, worship, ministries, music). Time-limited events belong on the Events page.
export const heroSlides = [
  {
    src: '/images/hero/hero-1.jpg',
    alt: 'Worship at TNC UDSM',
    eyebrow: 'SDA Public Campus Ministries',
    title: 'Welcome to TNC UDSM',
    accent: 'Faith, Fellowship and Service',
    text: 'The Seventh-day Adventist family at TUCASA Nyerere Campus. Come worship, grow and serve with us.',
    primary: { label: 'Join TNC', to: '/register' },
    secondary: { label: 'Explore Our Faith', to: '/about#faith' },
  },
  {
    src: '/images/hero/hero-2.jpg',
    alt: 'Sabbath worship',
    eyebrow: 'Every Sabbath',
    title: 'Worship with us',
    accent: 'Sabbath School and Divine Service',
    text: 'A warm, welcoming service for every student. Find the times and the place.',
    primary: { label: 'Request a Bible Study', to: '/bible-study' },
    secondary: { label: 'Worship times', to: '/#worship' },
  },
  {
    src: '/images/hero/hero-3.jpg',
    alt: 'Ministries serving together',
    eyebrow: 'Ten ministries',
    title: 'Find your place to serve',
    accent: 'Music, Deacons, Communication and more',
    text: 'Every talent matters. Meet the ministries and the leaders who guide them.',
    primary: { label: 'Our ministries', to: '/departments' },
    secondary: { label: 'Meet the leaders', to: '/leadership' },
  },
  {
    src: '/images/hero/hero-4.jpg',
    alt: 'TNC-UDSM Choir',
    eyebrow: 'Music ministry',
    title: 'Praise through song',
    accent: 'The TNC-UDSM Choir',
    text: 'Lift your voice with the choir and praise teams that lead our worship every week.',
    primary: { label: 'Upcoming Events', to: '/events' },
    secondary: { label: 'Meet the TNC Choir', to: '/choir' },
  },
];
