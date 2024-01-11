// src/index.ts
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import app from "./server"; 

export const myFunction = functions.https.onRequest(onRequest(app));

// You can add other Firebase functions here if needed
