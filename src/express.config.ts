import cors from "cors";
import express from "express";
import "./logger-config";

export const app = express();
export const router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
