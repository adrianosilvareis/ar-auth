import './containers';

import express from 'express';
import { appUser } from './user/main/user.server';

export const app = express();

app.use(express.json());

appUser(app);

app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});