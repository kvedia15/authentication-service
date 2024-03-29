export default class User {
  id: number;
  username: string;
  password: string;
  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
