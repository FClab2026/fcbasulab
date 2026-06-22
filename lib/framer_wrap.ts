function wrap(min: number, max: number, value: number) {
  const range = max - min;

  return ((((value - min) % range) + range) % range) + min;
}


export default wrap;