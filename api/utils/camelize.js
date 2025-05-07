/* eslint-disable no-self-compare */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const { toString } = Object.prototype;
const isObject = (obj) => obj === Object(obj);
// eslint-disable-next-line eqeqeq
const isArray = (obj) => toString.call(obj) == '[object Array]';
const isNumber = (obj) => {
  obj -= 0;
  return obj === obj;
};

const convertSnakeCaseToCamelCase = (string) => {
  if (isNumber(string) || string.toUpperCase() === string) {
    return string;
  }
  // eslint-disable-next-line no-useless-escape
  string = string.replace(/[\-_\s]+(.)?/g, (match, chr) =>
    chr ? chr.toUpperCase() : ''
  );
  // 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1);
};

const convertObjectKeys = (input) => {
  const output = {};
  Object.keys(input).forEach((key) => {
    const camelCaseKey = convertSnakeCaseToCamelCase(key);
    output[camelCaseKey] = camelize(input[key]);
  });
  return output;
};

const convertArrayItems = (input) => {
  const output = [];
  input.forEach((item) => {
    output.push(camelize(item));
  });
  return output;
};

const camelize = (input) => {
  if (!(isObject(input) || isArray(input))) {
    return input;
  }

  let result;

  if (isObject(input)) {
    // handle object keys
    input = JSON.parse(JSON.stringify(input)); // to Handle Sequelize Data
    result = {};
    result = convertObjectKeys(input);
  }

  if (isArray(input)) {
    // handle array items
    result = [];
    result = convertArrayItems(input);
  }

  return result;
};

module.exports = camelize;
