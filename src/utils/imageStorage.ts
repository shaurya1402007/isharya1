// Robust IndexedDB storage for storing high-res photos without localStorage 5MB limit

const DB_NAME = 'IsharyaPhotosDB';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhotoToDB(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback to localStorage', err);
    try {
      localStorage.setItem(`photo_${key}`, dataUrl);
    } catch {
      // ignore
    }
  }
}

export async function getPhotoFromDB(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return localStorage.getItem(`photo_${key}`) || null;
  }
}

export async function getAllPhotosFromDB(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const keysReq = store.getAllKeys();
      const valsReq = store.getAll();
      tx.oncomplete = () => {
        const result: Record<string, string> = {};
        const keys = keysReq.result as string[];
        const vals = valsReq.result as string[];
        keys.forEach((k, i) => {
          result[k] = vals[i];
        });
        resolve(result);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return {};
  }
}
