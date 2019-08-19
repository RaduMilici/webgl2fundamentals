const getRotationValues = radians => {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  return { sin, cos };
};

export default getRotationValues;
