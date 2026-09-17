import { NativeModule, requireNativeModule } from 'expo';

import {
  PortholeModuleEvents,
  PackageSummary,
  Transaction,
} from './Porthole.types';

declare class PortholeModule extends NativeModule<PortholeModuleEvents> {
  // Constant
  version: string;

  // Capture control
  startCapture(): Promise<{ status: string }>;
  stopCapture(): Promise<{ status: string }>;

  // Pause / resume
  setPaused(paused: boolean): Promise<void>;
  getPaused(): Promise<boolean>;

  // Query
  getTransactions(offset: number, limit: number): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | null>;
  getCount(): Promise<number>;

  // Mutations
  clearTransactions(): Promise<void>;
  removeTransaction(id: string): Promise<void>;

  // Convenience: subscribe to the onNewPackage event with a typed callback
  addListener(
    eventName: 'onNewPackage',
    listener: (params: PackageSummary) => void
  ): { remove: () => void };
}

export default requireNativeModule<PortholeModule>('Porthole');