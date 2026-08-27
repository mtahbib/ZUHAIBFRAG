const fs = require('fs');
const file = 'src/otherBrands/data/reviews.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'name: "Amir Abed Khan",\n    location: "Chattogram",',
  'name: "Amir Abed Khan",\n    location: "Chattogram",\n    image: "/amir.jpg",'
);

fs.writeFileSync(file, content);
