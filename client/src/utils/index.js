import axios from 'axios';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';

function mapToDatabaseReadable(obj) {
  return {
    id: obj.value,
    name: obj.label
  }
}

function getAllInterns() {
  return axios.get(INTERN_GET_API)
    .then(res => {
      return res.data;
    })
}
  //   .then(res => {
  //     allInterns = res.data;
  //     console.log(allInterns);
  //   })
  // return allInterns

export { mapToDatabaseReadable, getAllInterns };