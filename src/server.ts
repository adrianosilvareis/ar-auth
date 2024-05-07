import "./containers";
import { app, router } from "./express.config";
import { appSession } from "./sessions/main/session.server";
import { appUser } from "./user/main/user.server";

app.use("/session", appSession(router));
app.use("/user", appUser(router));

const $PORT = process.env.PORT || 5000;

app.listen($PORT, () => {
  console.log(`Server is running on port ${$PORT}`);
});
