import express from 'express';
import SoHaHelper from '../tool/libs/soha';
import bodyParser from 'body-parser';
export const sohaHelper = new SoHaHelper();
// eslint-disable-next-line @typescript-eslint/no-var-requires
import authRoute from './routes/auth.route';
import subjectRoute from './routes/subjects.route';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    name: 'Phan Cong Son',
  });
});

app.use('/auth', authRoute);
app.use('/subjects', subjectRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
