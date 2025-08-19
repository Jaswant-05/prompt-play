export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  joinRoom: (code: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  join: (data: Object) => void
  start: (data: Object) => void
  error: (data: Object) => void
  joinedRoom: (data: Object) => void,
  playerJoined: (data: object) => void
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
  userId? : string
}

export enum QUIZ_STATUS {
  "DRAFT",
  "ACTIVE",
  "ENDED"
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
