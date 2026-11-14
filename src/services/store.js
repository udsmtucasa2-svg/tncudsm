// Local preview store (used only while VITE_API_URL is empty).
// Keeps content in this browser's localStorage, seeded from src/data/demo.js, so the admin
// panel works end to end before the backend exists. Not shared between devices.
import * as seed from '../data/demo.js';

const KEY = 'tnc-content-v1';
const NAMES = ['departments', 'leaders', 'events', 'sermons', 'resources', 'gallery', 'services', 'announcements', 'members', 'families', 'sports', 'requests'];

let memory = null;

const fresh = () => Object.fromEntries(NAMES.map((n) => [n, JSON.parse(JSON.stringify(seed[n] ?? []))]));

function read() {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...fresh(), ...JSON.parse(raw) } : fresh();
  } catch {
    memory = fresh();
  }
  return memory;
}

function write() {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    throw new Error('Browser storage is full. Remove some images and try again.');
  }
}

const delay = (v) => new Promise((r) => setTimeout(() => r(v), 120));
const nextId = (list) => list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;

export const store = {
  list: (name) => delay([...read()[name]]),
  create: (name, item) => {
    const list = read()[name];
    const row = { ...item, id: nextId(list) };
    if (name === 'leaders' && row.order == null) row.order = list.length + 1;
    list.push(row);
    write();
    return delay(row);
  },
  update: (name, id, patch) => {
    const list = read()[name];
    const i = list.findIndex((x) => String(x.id) === String(id));
    if (i < 0) return Promise.reject(new Error('Item not found'));
    list[i] = { ...list[i], ...patch, id: list[i].id };
    write();
    return delay(list[i]);
  },
  remove: (name, id) => {
    const state = read();
    state[name] = state[name].filter((x) => String(x.id) !== String(id));
    write();
    return delay({ ok: true });
  },
  // Runs fn(state) synchronously, saves, and resolves with its result. Used for multi-step edits.
  transact: (fn) => {
    try {
      const out = fn(read());
      write();
      return delay(out);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  reset: () => {
    memory = fresh();
    write();
    return delay({ ok: true });
  },
};

// Shrinks an uploaded image so it fits in localStorage (max 1400px wide, JPEG).
export function imageToDataUrl(file, maxW = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image'));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Reads a small file (a PDF) as a data URL so it fits in localStorage during local preview.
// With a backend connected, files are uploaded instead and this is not used.
export function fileToDataUrl(file, maxBytes = 2.5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) { reject(new Error('This file is too big for local preview (max 2.5 MB). It will work with the backend connected.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}