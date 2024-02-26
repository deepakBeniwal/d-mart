import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

const ErrorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ error: message });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default ErrorHandlerMiddleware;
