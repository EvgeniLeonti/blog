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

adapter.read = (table, id, sort) => {
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

  let entities = [];
  for (const file of fs.readdirSync(`${rootPath}/${table}`)) {
    entities.push(JSON.parse(fs.readFileSync(`${rootPath}/${table}/${file}`).toString()));
  }

  let compareFunctions = [];
  if (sort) {
    let sortingFields = Object.keys(sort).reverse(); // reverse as the arguments gets here in opposite order of appearing

    for (const sortField of sortingFields) {
      let isDESC = sort[sortField] === 1;
      let compareFunction;
      if (isDESC) {
        compareFunction = (e1, e2) => {
          if (e1[sortField] < e2[sortField]) {
            return 1;
          }
          if (e1[sortField] > e2[sortField]) {
            return -1;
          }
          return 0;
        };
      }
      else {
        compareFunction = (e1, e2) => {
          if (e1[sortField] > e2[sortField]) {
            return -1;
          }
          if (e1[sortField] < e2[sortField]) {
            return 1;
          }
          return 0;
        };
      }
      compareFunction.sortBy = sortField;
      compareFunctions.push(compareFunction);
    }
    console.log(compareFunctions)
  }


  let compareFunction = (e1, e2) => {
    for (const fun of compareFunctions) {
      let compareResult = fun(e1, e2);
      if (compareResult !== 0) {
        return compareResult;
      }
    }
    return 0;
  };

  let backup = entities;
  entities = entities.sort(compareFunction);
  return entities;
};

adapter.update = (table, postObject) => {
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