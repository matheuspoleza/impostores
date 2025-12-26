// Platform storage adapter interface
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Implementação in-memory temporária (para testar sem AsyncStorage)
const memoryStorage: Record<string, string> = {};

const inMemoryStorage: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/5a0fea74-64a3-43f1-9812-2a4cab640cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'platform/storage.ts:12',message:'getItem called (in-memory)',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return memoryStorage[key] || null;
  },
  async setItem(key: string, value: string): Promise<void> {
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/5a0fea74-64a3-43f1-9812-2a4cab640cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'platform/storage.ts:16',message:'setItem called (in-memory)',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    memoryStorage[key] = value;
  },
  async removeItem(key: string): Promise<void> {
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/5a0fea74-64a3-43f1-9812-2a4cab640cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'platform/storage.ts:20',message:'removeItem called (in-memory)',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    delete memoryStorage[key];
  },
};

// Exportar implementação in-memory temporária
// TODO: Voltar para AsyncStorage depois de confirmar que resolve o problema
export const storage: StorageAdapter = inMemoryStorage;

