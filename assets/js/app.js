console.log("app.js loaded");

// Set the SVG and margin Parameters
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
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

var chosenXAxis = "age";

// Function for updating x-axis scale
function xScale(medData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(medData, d => d[chosenXAxis])])
        .range([0, width]);
    
    return xLinearScale;
};

// Function for updating x-axis var
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
}

// Function for updating circles when axes change
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]));
    
    return circlesGroup;
}


// Read in the data from the csv
d3.csv("assets/data/data.csv").then(function(medData, err) {
    if (err) throw err;

    // Convert data to numerical
    medData.forEach(data => {
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

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

    // Append x-axis labels
    var labelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 20})`);
    
    var ageLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('active', true)
        .text('Median Age');

    var incomeLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .classed('inactive', true)
        .text('Median Income');

    var povertyLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'poverty')
        .classed('inactive', true)
        .text('Poverty (%)');

    // Append y-axis labels
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - (height / 2))
        .attr('y', 0 - margin.left)
        .attr('dy', '1em')
        .classed('axis-left', true)
        .text('Poverty');


    // Append Circles of Data
    var circlesGroup = chartGroup.selectAll('circle')
        .data(medData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d.poverty))
        .attr('r', 20)
        .attr('fill', 'lightblue')
        .attr('opacity', .7);

    // Event Handler
    labelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value != chosenXAxis) {
                chosenXAxis = value;

                xLinearScale = xScale(medData, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                if (chosenXAxis === 'age') {
                    ageLabel.classed('active', true)
                        .classed('inactive', false)
                    incomeLabel.classed('active', false)
                        .classed('inactive', true)
                    povertyLabel.classed('active', false)
                        .classed('inactive', true)
                }
                else if (chosenXAxis === 'income') {
                    ageLabel.classed('active', false)
                        .classed('inactive', true)
                    incomeLabel.classed('active', true)
                        .classed('inactive', false)
                    povertyLabel.classed('active', false)
                        .classed('inactive', true)
                }
                else {
                    ageLabel.classed('active', false)
                        .classed('inactive', true)
                    incomeLabel.classed('active', false)
                        .classed('inactive', true)
                    povertyLabel.classed('active', true)
                        .classed('inactive', false)
                }
            }
        })

});