const fs = require('fs');
const file = 'src/otherBrands/data/reviews.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Farhan Sadik",\n    location: "Dhaka",',
  'name: "Farhan Sadik",\n    location: "Dhaka",\n    image: "/sadik.jpg",'
);

fs.writeFileSync(file, content);
