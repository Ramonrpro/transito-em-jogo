import type { Tentativa } from '../simulado/tipos.ts';

export interface EntradaErrada {
  qid: string;
  acertosSeguidos: number;
  erradaEm: number;
}

export interface EntradaVista {
  qid: string;
}

export interface Registros {
  tentativas: Tentativa;
  erradas: EntradaErrada;
  vistas: EntradaVista;
}
export type NomeStore = keyof Registros;
export type Tudo = { [S in NomeStore]: Registros[S][] };

export const NOME_BANCO = 'transito-em-jogo';
export const VERSAO_BANCO = 1;
const CHAVES: Record<NomeStore, 'id' | 'qid'> = { tentativas: 'id', erradas: 'qid', vistas: 'qid' };
const STORES = Object.keys(CHAVES) as NomeStore[];

export interface Banco {
  /** false quando caiu para memória: os dados somem ao fechar a aba. */
  persistente: boolean;
  get<S extends NomeStore>(store: S, chave: string): Promise<Registros[S] | undefined>;
  getAll<S extends NomeStore>(store: S): Promise<Registros[S][]>;
  put<S extends NomeStore>(store: S, valor: Registros[S]): Promise<void>;
  delete(store: NomeStore, chave: string): Promise<void>;
  clear(store: NomeStore): Promise<void>;
  /** Troca o conteúdo de todos os stores numa única transação (tudo ou nada). */
  substituirTudo(dados: Tudo): Promise<void>;
}

function esperar<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function terminar(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('transação abortada'));
  });
}

function bancoIndexedDB(db: IDBDatabase): Banco {
  const stores = (nomes: NomeStore[], modo: IDBTransactionMode) => {
    const tx = db.transaction(nomes, modo);
    return { tx, de: (n: NomeStore) => tx.objectStore(n), pronto: terminar(tx) };
  };
  return {
    persistente: true,
    async get(store, chave) {
      const { de } = stores([store], 'readonly');
      return (await esperar(de(store).get(chave))) ?? undefined;
    },
    async getAll(store) {
      const { de } = stores([store], 'readonly');
      return esperar(de(store).getAll());
    },
    async put(store, valor) {
      const { de, pronto } = stores([store], 'readwrite');
      de(store).put(valor);
      await pronto;
    },
    async delete(store, chave) {
      const { de, pronto } = stores([store], 'readwrite');
      de(store).delete(chave);
      await pronto;
    },
    async clear(store) {
      const { de, pronto } = stores([store], 'readwrite');
      de(store).clear();
      await pronto;
    },
    async substituirTudo(dados) {
      const { de, pronto } = stores(STORES, 'readwrite');
      for (const s of STORES) {
        de(s).clear();
        for (const v of dados[s]) de(s).put(v);
      }
      await pronto;
    },
  };
}

export function bancoEmMemoria(): Banco {
  const dados: { [S in NomeStore]: Map<string, Registros[S]> } = {
    tentativas: new Map(), erradas: new Map(), vistas: new Map(),
  };
  const mapa = (s: NomeStore) => dados[s] as Map<string, unknown>;
  const copia = <T>(v: T): T => structuredClone(v);
  return {
    persistente: false,
    async get(store, chave) {
      const v = mapa(store).get(chave);
      return v === undefined ? undefined : copia(v as never);
    },
    async getAll(store) {
      return [...mapa(store).values()].map((v) => copia(v as never));
    },
    async put(store, valor) {
      mapa(store).set((valor as unknown as Record<string, string>)[CHAVES[store]], copia(valor));
    },
    async delete(store, chave) {
      mapa(store).delete(chave);
    },
    async clear(store) {
      mapa(store).clear();
    },
    async substituirTudo(novos) {
      for (const s of STORES) {
        const m = mapa(s);
        m.clear();
        for (const v of novos[s]) m.set((v as unknown as Record<string, string>)[CHAVES[s]], copia(v));
      }
    },
  };
}

function abrirIndexedDB(fabrica: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = fabrica.open(NOME_BANCO, VERSAO_BANCO);
    req.onupgradeneeded = () => {
      // Só cria o que falta; nunca apaga stores ou dados existentes.
      const db = req.result;
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: CHAVES[s] });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('abertura do banco bloqueada'));
  });
}

/** Abre o IndexedDB; se não der (modo privado, bloqueio), usa memória com `persistente: false`. */
export async function abrirBanco(fabrica?: IDBFactory): Promise<Banco> {
  try {
    const f = fabrica ?? globalThis.indexedDB;
    if (!f) throw new Error('IndexedDB indisponível');
    return bancoIndexedDB(await abrirIndexedDB(f));
  } catch {
    return bancoEmMemoria();
  }
}
