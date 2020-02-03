import * as d3 from 'd3'

export default (x, y) => {
  const svgWidth = '400px',
    svgHeight = '300px',
    barPadding = '5px'
  const barWidth = svgWidth / y.length

  d3
    .select('.chart-div')
    .style('height', svgHeight)
    .style('width', svgWidth)
    .style('background-color', 'grey')
  // svg
  //   .selectAll('rect')
  //   .data(y)
  //   .enter()
  //   .append('rect')
  //   .attr('y', d => svgHeight - d)
  //   .attr('height', d => d)
  //   .attr('width', barWidth - barPadding)
  //   .attr('transform', (d, i) => {
  //     const translate = [barWidth * i, 0]
  //     return 'translate(' + translate + ')'
  //   })
}
