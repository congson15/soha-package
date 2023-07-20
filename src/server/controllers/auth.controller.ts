import { sohaHelper } from '../app';
import { validationResult } from 'express-validator';

async function postLogin(_req: any, _res: any): Promise<any> {
  try {
    const errors = validationResult(_req);
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line no-unused-vars
    const { username, password } = _req.body;
    sohaHelper.setupAccount(username, password);
    return _res.status(201).json(await sohaHelper.login());
  } catch (error) {}
}

export { postLogin };
