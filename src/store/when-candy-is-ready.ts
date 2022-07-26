import { when } from 'mobx';
import { candyStore } from './candy.store';

export const whenCandyIsReady = () =>
  when(() => candyStore.isReady);
