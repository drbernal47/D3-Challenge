console.log("app.js loaded");

// Set the SVG and margin Parameters
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

console.log(width);
console.log(height);

// Wrap the SVG to the chart area
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append chartGroup to SVG
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initialize parameters

var chosenXAxis = "healthcare";

// Function for updating x-axis
function xScale(medData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(medData, d => d[chosenXAxis])])
        .range([0, width]);
    
    return xLinearScale;
};


// Function to draw the scatterplot with given parameters

    // Create axes


    // Create circles


    // Create tooltips


// Read in the data from the csv
d3.csv("assets/data/data.csv").then(function(medData, err) {
    if (err) throw err;

    console.log(medData);

    // Determine axes
    var xLinearScale = xScale(medData, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(medData, d => d.poverty)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes
    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);
});