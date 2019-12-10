const fs = require('fs');

const rootPath = "data";
const ERROR = {
  DOESNT_EXIST: "does not exist",
  GENERAL_ERROR: "general error",
};
let adapter = {};

adapter.init = () => {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(`${rootPath}`);
    fs.mkdirSync(`${rootPath}/authors`);
    fs.mkdirSync(`${rootPath}/posts`);
  }
  else {
    if (!fs.existsSync(`${rootPath}/authors`)) {
      fs.mkdirSync(`${rootPath}/authors`);
    }
    if (!fs.existsSync(`${rootPath}/posts`)) {
      fs.mkdirSync(`${rootPath}/posts`);
    }
  }
};

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
    try {
      return JSON.parse(fs.readFileSync(`${rootPath}/${table}/${id}.json`).toString());
    }
    catch (e) {
      if (e.code === "ENOENT") {
        throw new Error(ERROR.DOESNT_EXIST);
      }
      throw new Error(ERROR.GENERAL_ERROR); // todo log
    }
  }

  let posts = [];
  for (const file of fs.readdirSync(`${rootPath}/${table}`)) {
    posts.push(JSON.parse(fs.readFileSync(`${rootPath}/${table}/${file}`).toString()));
  }
  return posts;
};

adapter.update = (table, postObject) => {
  // read the old object to verify it exists
  let oldPostObject = adapter.read(table, postObject.id);

  let filePath = `${rootPath}/${table}/${postObject.id}.json`;
  let write = fs.openSync(filePath, 'w');
  fs.writeFileSync(filePath, JSON.stringify(postObject));
  fs.closeSync(write);

  return adapter.read(table, postObject.id);
};

adapter.delete = (table, id) => {
  // read the old object to verify it exists
  let oldPostObject = adapter.read(table, id);

  let filePath = `${rootPath}/${table}/${id}.json`;
  fs.unlinkSync(filePath);

  return oldPostObject;
};



exports.adapter = adapter;