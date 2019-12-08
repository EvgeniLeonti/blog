const fs = require('fs');

const rootPath = "data";
let adapter = {};

adapter.create = (table, postObject) => {
  // todo validate postObject.id
  let filePath = `${rootPath}/${table}/${postObject.id}.json`;
  let write = fs.openSync(filePath, 'w');
  fs.writeFileSync(filePath, JSON.stringify(postObject));
  fs.closeSync(write);


  return postObject;
};

adapter.read = (table, id) => {
  if (id) {
    return JSON.parse(fs.readFileSync(`${rootPath}/${table}/${id}.json`).toString());
  }

  let posts = [];
  for (const file of fs.readdirSync(`${rootPath}/${table}`)) {
    posts.push(JSON.parse(fs.readFileSync(`${rootPath}/${table}/${file}`).toString()));
  }
  return posts;
};



exports.adapter = adapter;