export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  joinRoom: (code: string) => void;
  start_quiz: (code: string) => void;
  submit_answer: (p: { code: string; questionId: number; optionId: number }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  join: (data: Object) => void
  start: (data: Object) => void
  error: (data: Object) => void
  joinedRoom: (data: Object) => void
  playerLeft : (data: Object) => void
  playerJoined: (data: Object) => void  
  question: (data: Object) => void
  answer_received: (data: Object) => void
  reveal: (data: Object) => void
  leaderboard: (data: Object) => void
  roomState: (data: Object) => void
  quizEnded: () => void
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
  userId? : string
  username? : string
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
