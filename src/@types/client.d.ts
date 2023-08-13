declare global {
  namespace Express {
    interface Request {
      client: ClientData;
    }
  }
}

export interface ClientData {
  client_id: string;
  client_secret: string;
}
