export const getParseObject = (object, fields) =>
  fields.reduce((acc, val) => {
    return {
      ...acc,
      id: object.id,
      [val]: object.get(val)
    };
  }, {});

export const ucFirst = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const sentenceCase = str => {
  return ucFirst(str.replace(/([A-Z])/g, ' $1'));
};

export const getChannelName = (uid, rid) => (uid > rid ? `${uid}-${rid}` : `${rid}-${uid}`);
