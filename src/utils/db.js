import { openDB } from 'idb';

const DB_NAME = 'PrintPerfectDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    }
  });
}

export async function saveProject(project) {
  try {
    const db = await initDB();
    const payload = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    await db.put(STORE_NAME, payload);
    return payload;
  } catch (err) {
    console.error('IndexedDB save project error', err);
    return null;
  }
}

export async function getRecentProjects() {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const projects = await store.getAll();
    return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  } catch (err) {
    console.error('IndexedDB fetch error', err);
    return [];
  }
}

export async function deleteProject(id) {
  try {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
    return true;
  } catch (err) {
    console.error('IndexedDB delete error', err);
    return false;
  }
}

export async function clearAllProjects() {
  try {
    const db = await initDB();
    await db.clear(STORE_NAME);
    return true;
  } catch (err) {
    console.error('IndexedDB clear error', err);
    return false;
  }
}
