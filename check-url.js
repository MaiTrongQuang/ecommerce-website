
const http = require('http');

const url = 'http://localhost:3000/images/categories/trang-phuc-truyen-thong.png';

http.get(url, (res) => {
  console.log(`StatusCode: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('Image is accessible!');
  } else {
    console.log('Image is NOT accessible.');
  }
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
