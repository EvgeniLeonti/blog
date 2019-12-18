const fs = require('fs');

const DATA_PATH = "data";
const ENTITIES_PATH = "entities";
const ERROR = {
  DOESNT_EXIST: "does not exist",
  GENERAL_ERROR: "general error",
};
let adapter = {};


const entities = fs.readdirSync(ENTITIES_PATH)
  .map(fileName => fileName.split(".")[0]) // remove the .js extension from filename
  .filter(className => className !== "Entity") // ignore the abstract class Entity
  .map(className => require(`../${ENTITIES_PATH}/${className}.js`)[className]);

adapter.init = () => {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(`${DATA_PATH}`);
    entities.forEach(entity => fs.mkdirSync(`${DATA_PATH}/${entity.pluralName.toLowerCase()}`));
  }
  else {
    entities.forEach(entity => {
      if (!fs.existsSync(`${DATA_PATH}/${entity.pluralName.toLowerCase()}`)) {
        fs.mkdirSync(`${DATA_PATH}/${entity.pluralName.toLowerCase()}`)
  
      }
    });
  }
};

adapter.create = (table, postObject) => {
  // todo validate postObject.id
  let filePath = `${DATA_PATH}/${table}/${postObject.id}.json`;
  let write = fs.openSync(filePath, 'w');
  fs.writeFileSync(filePath, JSON.stringify(postObject));
  fs.closeSync(write);


  return postObject;
};

adapter.read = (table, id, sort) => {
  if (id) {
    try {
      return JSON.parse(fs.readFileSync(`${DATA_PATH}/${table}/${id}.json`).toString());
    }
    catch (e) {
      if (e.code === "ENOENT") {
        throw new Error(ERROR.DOESNT_EXIST);
      }
      throw new Error(ERROR.GENERAL_ERROR); // todo log
    }
  }

  let entities = [];
  for (const file of fs.readdirSync(`${DATA_PATH}/${table}`)) {
    entities.push(JSON.parse(fs.readFileSync(`${DATA_PATH}/${table}/${file}`).toString()));
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
  let filePath = `${DATA_PATH}/${table}/${postObject.id}.json`;
  let write = fs.openSync(filePath, 'w');
  fs.writeFileSync(filePath, JSON.stringify(postObject));
  fs.closeSync(write);

  return adapter.read(table, postObject.id);
};

adapter.delete = (table, id) => {
  // read the old object to verify it exists
  let oldPostObject = adapter.read(table, id);

  let filePath = `${DATA_PATH}/${table}/${id}.json`;
  fs.unlinkSync(filePath);

  return oldPostObject;
};



exports.adapter = adapter;