import "./containers";
import { app } from "./express.config";
import { appUser } from "./user/main/user.server";

appUser(app);

const $PORT = process.env.PORT || 5000;

app.listen($PORT, () => {
  console.log(`Server is running on port ${$PORT}`);
});
