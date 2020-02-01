//Normal distribution function using Box-Muller transform

const normalDistributionFunc = function() {
  let u = 0 //mean
  let v = 0 //variance
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

module.exports = {normalDistributionFunc}
