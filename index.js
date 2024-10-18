// Importar dependencias (configurar en package.json)
import express from "express";
import connection from "./database/connection.js"
import cors from "cors";
import bodyParser from "body-parser";
import UserRoutes from "./routes/users.js"
import PublicationRoutes from "./routes/publications.js"
import FollowRoutes from "./routes/follows.js"

