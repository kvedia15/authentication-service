export default class User {
  private id: number;
  private username: string;
  private password: string | null;
  private email: string | null;
  private sessionToken: string | null;
  constructor(
    id: number,
    username: string,
    password: string | null = null,
    email: string | null = null,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.sessionToken = null;
  }

  public toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      sessionToken: this.sessionToken,
    };
  }

  public get Id(): number {
    return this.id;
  }

  public get Password(): string | null {
    return this.password;
  }

  public get Username(): string {
    return this.username;
  }

  public get SessionToken(): string | null {
    return this.sessionToken;
  }

  public set SessionToken(sessionToken: string) {
    this.sessionToken = sessionToken;
  }
}
