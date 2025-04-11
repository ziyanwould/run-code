const DB_NAME = 'codeRunDB';
const STORE_NAME = 'localGists';
const DB_VERSION = 1;

class LocalDB {
  constructor() {
    this.db = null;
  }

  async init() {
    if (this.db) return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: true 
          });
        }
      };
    });
  }

  async saveGist(data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const gist = {
        description: data.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        files: data.files,
        public: true
      };

      const request = store.add(gist);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateGist(id, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const gist = {
        id,
        description: data.description,
        updated_at: new Date().toISOString(),
        files: data.files,
        public: true
      };

      const request = store.put(gist);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getGists(page = 1, per_page = 20) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const allGists = request.result;
        // 按更新时间倒序排序
        allGists.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        // 分页
        const start = (page - 1) * per_page;
        const end = start + per_page;
        resolve(allGists.slice(start, end));
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async deleteGist(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getGist(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllGists() {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const allGists = request.result;
        // 按更新时间倒序排序
        allGists.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        resolve(allGists);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

export const localDb = new LocalDB();
