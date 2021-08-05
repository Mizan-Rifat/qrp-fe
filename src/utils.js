export const getParseObject = object => ({
  id: object.id,
  ...object.attributes
});
export const getParseObjects = objects => objects.map(object => getParseObject(object));

export const ucFirst = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const sentenceCase = str => {
  return ucFirst(str.replace(/([A-Z])/g, ' $1'));
};

export const getChannelName = (uid, rid) => (uid > rid ? `${uid}-${rid}` : `${rid}-${uid}`);
