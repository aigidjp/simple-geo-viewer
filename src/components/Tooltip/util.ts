export const getPropertiesObj = (object: any) => {
  if ('properties' in object) {
    return {
      properties: object.properties,
      labels: Object.keys(object.properties),
    };
  }

  return {
    properties: object,
    labels: Object.keys(object),
  };
};
