import { makeAutoObservable } from "mobx";

class PasswordInputStore {
    password = "";

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setPassword(password: string) {
        this.password = password;
    }

    validatePassword(second_password: string) {
        return this.password === second_password;
    }
}

export const passwordInputStore = new PasswordInputStore();