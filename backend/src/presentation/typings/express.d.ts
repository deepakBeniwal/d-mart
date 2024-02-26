declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string; // Include user email in the request
      };
    }
  }
}
