import Role from './role';

export default class User {
  private id: number;
  private username: string;
  private password: string | null;
  private email: string | null;
  private sessionToken: string | null;
  private refreshToken: string | null;
  private role: Role | null;
  constructor({
    id,
    username,
    role,
    password = null,
    email = null,
    sessionToken = null,
  }: {
    id: number;
    username: string;
    role?: Role | null;
    password?: string | null;
    email?: string | null;
    sessionToken?: string | null;
  }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.sessionToken = sessionToken;
    this.refreshToken = null;
    this.role = role || null;
  }

  public toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      sessionToken: this.sessionToken,
      refreshToken: this.refreshToken
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

  public get RefreshToken(): string | null {
    return this.refreshToken;
  }

  public get Email(): string | null {
    return this.email;
  }

  public set SessionToken(sessionToken: string | null) {

    this.sessionToken = sessionToken;
  }

  public set RefreshToken(refreshToken: string | null) {

    this.refreshToken = refreshToken;
  }

  public get Role(): Role | null {
    return this.role;
  }

  public set Role(role: Role) {
    this.role = role;
  }
}
