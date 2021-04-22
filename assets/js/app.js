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


// Function to draw the scatterplot with given parameters

    // Create axes


    // Create circles


    // Create tooltips


// Read in the data from the csv
d3.csv("assets/data/data.csv").then(function(ourData, err) {
    if (err) throw err;

    console.log(ourData);
});