type SessionDatabase = {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expires: Date;
  createdAt: Date;
  active: boolean;
};

export class SessionApplication {
  constructor(
    public readonly userId: string,
    public readonly token: string,
    public readonly refreshToken: string,
    public readonly expires: Date,
    private readonly active: boolean
  ) {}

  isExpired(): boolean {
    return this.expires < new Date();
  }

  isActive(): boolean {
    return this.active;
  }

  static create(session: SessionDatabase) {
    return new SessionApplication(
      session.userId,
      session.token,
      session.refreshToken,
      session.expires,
      session.active
    );
  }
}
