import SoHaHelper from './libs/soha';

const test = async () => {
  const sohaHelper = new SoHaHelper('3118410373', 'hoanghai');
  const x = await sohaHelper.login();
  const y = await sohaHelper.getSubjectsByName('866101');
  console.log(x, y);
};
test();
