import "./containers";
import { app } from "./express.config";
import { appUser } from "./user/main/user.server";

appUser(app);

app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
