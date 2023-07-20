import { sohaHelper } from '../app';

async function getSubjectByName(_req: any, _res: any): Promise<any> {
  try {
    // eslint-disable-next-line no-unused-vars
    const { subjectName } = _req.body;
    console.log(subjectName);
    return _res.json(await sohaHelper.getSubjectsByName(subjectName));
  } catch (error) {}
}

export { getSubjectByName };
