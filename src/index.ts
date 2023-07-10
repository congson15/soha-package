import SoHaHelper from './libs/soha';

const pcs = new SoHaHelper('3118410373', 'hoanghai');
pcs.login().then(() => {
  pcs.filterSubjects('866101').then((data) => {
    console.log(data?.subjectList);
  });
});
