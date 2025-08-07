/**
 * Cache simples para evitar requisições repetidas
 */
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 30000; // 30 segundos

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Verifica se o cache expirou
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

export const organizationCache = new SimpleCache();