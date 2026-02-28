import app from "./app.js";
import { env } from "./config/env.js";
import "./services/initDb.js";

app.listen(env.port, () => {
  console.log(`SoftSystem97 running on ${env.appBaseUrl}`);
});
