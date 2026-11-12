// Static site settings (not security-sensitive).
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa6';

export const about = {
  vision: 'A united student family growing in Christ and shining as a light across the University of Dar es Salaam.',
  mission: 'To share the everlasting gospel with every student through worship, Bible study, music, health outreach and service.',
  beliefs: 'We accept the Bible as our only creed and hold the fundamental beliefs of the Seventh-day Adventist Church.',
};

export const contact = {
  email: 'info@tncudsm.com',
  location: 'TUCASA Nyerere Campus, University of Dar es Salaam',
  handle: '@tncudsm',
};

// Replace each "#" with the real page URL.
export const socials = [
  { name: 'Facebook', url: '#', Icon: FaFacebookF },
  { name: 'Instagram', url: '#', Icon: FaInstagram },
  { name: 'YouTube', url: '#', Icon: FaYoutube },
  { name: 'TikTok', url: '#', Icon: FaTiktok },
];

// "Explore Our Faith" (About page). Edit freely: these are the points shown as cards.
export const faith = [
  { icon: 'faith', title: 'The Bible', text: 'We accept the Bible as the Word of God and our only rule of faith.' },
  { icon: 'evangelism', title: 'Salvation in Christ', text: 'We are saved by grace through faith in Jesus Christ.' },
  { icon: 'vision', title: 'The Sabbath', text: 'We rest and worship on the seventh day, the Sabbath, as a gift from God.' },
  { icon: 'mission', title: 'The Second Coming', text: 'We look forward to the return of Jesus and live in that hope.' },
  { icon: 'medical', title: 'Health and wholeness', text: 'We care for body, mind and spirit as a whole.' },
  { icon: 'service', title: 'Service', text: 'We serve our campus and community in the spirit of Christ.' },
];

export const choir = {
  intro: 'The TNC-UDSM Choir leads our worship through song, on Sabbath and at special programmes and concerts. Singers and instrumentalists of every level are welcome.',
  join: 'To join, register as a member and tell the Music department, or message us from the Contact page.',
};
