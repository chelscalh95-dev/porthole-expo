import { registerWebModule, NativeModule } from 'expo';

import {
  PortholeModuleEvents,
  Transaction,
} from './Porthole.types';

class PortholeModule extends NativeModule<PortholeModuleEvents> {
  version = '0.0.0-web';

  async startCapture(): Promise<{ status: string }> {
    return { status: 'unsupported' };
  }

  async stopCapture(): Promise<{ status: string }> {
    return { status: 'unsupported' };
  }

  async setPaused(_paused: boolean): Promise<void> {}
  async getPaused(): Promise<boolean> {
    return false;
  }

  async getTransactions(_offset: number, _limit: number): Promise<Transaction[]> {
    return [];
  }

  async getTransaction(_id: string): Promise<Transaction | null> {
    return null;
  }

  async getCount(): Promise<number> {
    return 0;
  }

  async clearTransactions(): Promise<void> {}
  async removeTransaction(_id: string): Promise<void> {}
}

export default registerWebModule(PortholeModule, 'PortholeModule');