import { Request } from "express-jwt";

export interface JwtPayload {
  userId: string,
}

export type JwtRequest = Request<JwtPayload>;

export interface RegPayload {
  email: string,
  password: string,
  name: string,
}

export interface LoginPayload {
  email: string,
  password: string,
}