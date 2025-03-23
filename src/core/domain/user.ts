import { randomUUID, UUID } from 'crypto';
import Role from './role';
import { Optional } from './result';

export default class User {
  private id?: UUID;
  private username: string;
  private password: Optional<string>;
  private email: Optional<string>;
  private sessionToken: Optional<string>;
  private refreshToken: Optional<string>;
  private role: Optional<Role>;

  constructor({
    id,
    username,
    role,
    password = null,
    email = null,
    sessionToken = null,
  }: {
    id?: UUID;
    username: string;
    role?: Optional<Role>;
    password?: Optional<string>;
    email?: Optional<string>;
    sessionToken?: Optional<string>;
  }) {
    this.id = id || randomUUID();
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

  public get Id(): UUID {
    if (!this.id) {
      this.id = randomUUID();
    }
    return this.id;
  }

  public get Password(): Optional<string> {
    return this.password;
  }

  public get Username(): string {
    return this.username;
  }

  public get SessionToken(): Optional<string> {
    return this.sessionToken;
  }

  public get RefreshToken(): Optional<string> {
    return this.refreshToken;
  }

  public get Email(): Optional<string> {
    return this.email;
  }

  public set SessionToken(sessionToken: Optional<string>) {

    this.sessionToken = sessionToken;
  }

  public set RefreshToken(refreshToken: Optional<string>) {

    this.refreshToken = refreshToken;
  }

  public get Role(): Optional<Role> {
    return this.role;
  }

  public set Role(role: Role) {
    this.role = role;
  }
}
