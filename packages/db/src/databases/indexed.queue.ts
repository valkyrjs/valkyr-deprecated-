import { IDBPDatabase, IDBPTransaction } from "idb";

const BATCH_SIZE = 1000;

export class IndexedDbTransactionQueue {
  readonly #db: IDBPDatabase;
  readonly #queue: TransactionHandler[] = [];

  #processing = false;

  constructor(readonly name: string, db: IDBPDatabase, readonly log: (message: string) => void) {
    this.push = this.push.bind(this);
    this.#db = db;
  }

  push(txs: TransactionHandler[]) {
    this.#queue.push(...txs);
    this.#process();
  }

  async #process() {
    if (this.#processing === true) {
      return false;
    }

    this.#processing = true;

    const txs = this.#queue.splice(0, BATCH_SIZE);
    if (txs.length === 0) {
      this.#processing = false;
      this.log(`IDB [${this.name}]: Transaction queue hydrated, going dormant`);
      return;
    }

    this.log(`IDB [${this.name}]: Processing ${txs.length} transactions`);

    const tx = this.#db.transaction(this.name, "readwrite");
    await Promise.all([...txs.map((handle) => handle(tx)), tx.done]);

    this.log(`IDB [${this.name}]: Transactions processed`);

    this.#processing = false;
    this.#process();
  }
}

export type TransactionHandler = (tx: Transaction) => Promise<any>;

export type Transaction = IDBPTransaction<unknown, [string], "readwrite">;
