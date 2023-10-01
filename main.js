
const displayWeightHeight = async function (){
  let plotData = []
fetch( `https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json` )
.then( data => data.json() )
.then( jsonData => {
  for (let i = 0; i < 151; i++) {
    let wStr = jsonData.pokemon[i].weight
    let hStr = jsonData.pokemon[i].height
    let newW = wStr.replace("kg", "");
    let newH = hStr.replace("m", "");
    let finalW = newW.trim()
    let finalH = newH.trim()
    plotData.push([finalW,finalH,jsonData.pokemon[i].name, jsonData.pokemon[i].img])
    console.log(plotData[i][3])
  }
  var margin = {top: 15, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var svg = d3.select("#div1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          svg.append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 20))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .style("text-decoration", "underline")  
          .text("Gen1 Pokemon Height vs Weight");        

  var x = d3.scaleLinear()
    .domain([0, 325])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Pokemon Weight");

  var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Pokemon Height");

  var tooltip = d3.select("#div1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    var imgString =`<img src=${d[3]} />`;
    console.log(d[3])
    tooltip
    .data(plotData)
      .html(`The height of ${d[2]} is ${d[1]} and its weight is ${d[0]} ${imgString}`)
      .style("left", (d3.mouse(this)[0]+90) + "px") 
  }

  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  svg.append('g')
    .selectAll("dot")
    .data(plotData)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", 4)
      .style("fill", "#FF0000")
      .style("opacity", 0.3)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )
})
}

displayWeightHeight()