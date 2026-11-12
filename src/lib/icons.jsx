// One place for every icon used in content. Data (ministries, etc.) stores an icon KEY
// such as "music"; this map turns the key into a React icon. Add new icons here.
import {
  LuMegaphone, LuSparkles, LuBookOpen, LuGraduationCap, LuStethoscope, LuScale, LuHardHat,
  LuHeartHandshake, LuMusic, LuHandHelping, LuUsers, LuCross, LuGlobe, LuTelescope, LuTarget,
  LuCalendarDays, LuMic, LuLibrary, LuLandmark,
} from 'react-icons/lu';

export const ICONS = {
  communication: LuMegaphone,
  youth: LuSparkles,
  evangelism: LuBookOpen,
  education: LuGraduationCap,
  medical: LuStethoscope,
  liberty: LuScale,
  projects: LuHardHat,
  possibility: LuHeartHandshake,
  music: LuMusic,
  deacons: LuHandHelping,
  users: LuUsers,
  faith: LuCross,
  service: LuGlobe,
  vision: LuTelescope,
  mission: LuTarget,
  events: LuCalendarDays,
  sermons: LuMic,
  resources: LuLibrary,
  church: LuLandmark,
};

export const iconOptions = [
  ['communication', 'Megaphone'], ['youth', 'Sparkles'], ['evangelism', 'Open book'], ['education', 'Graduation cap'],
  ['medical', 'Stethoscope'], ['liberty', 'Scales'], ['projects', 'Hard hat'], ['possibility', 'Heart and hands'],
  ['music', 'Music note'], ['deacons', 'Helping hand'], ['users', 'People'], ['church', 'Church'],
];

export function Icon({ name, className, size }) {
  const Cmp = ICONS[name] || LuLandmark;
  return <Cmp className={className} size={size} aria-hidden="true" />;
}
