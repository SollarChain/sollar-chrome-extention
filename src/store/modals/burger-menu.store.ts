import { makeAutoObservable } from 'mobx'

class BurgerMenuStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

export const burgerMenuStore = new BurgerMenuStore();
