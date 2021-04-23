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
var chosenYAxis = "healthcare"

// Function for updating x-axis scale
function xScale(medData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(medData, d => d[chosenXAxis])])
        .range([0, width]);
    
    return xLinearScale;
}

// Function for updating x-axis var
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

// Function for updating y-axis scale
function yScale(medData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(medData, d => d[chosenYAxis])])
        .range([height, 0]);

    return yLinearScale;
}

// Function for updating y-axis var
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// Function for updating circles when x-axis changes
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]));
    
    return circlesGroup;
}

// Function for updating circle text when x-axis changes
function renderXCircleText(circlesText, newXScale, chosenXAxis) {
    circlesText.transition()
        .duration(1000)
        .attr('x', d => newXScale(d[chosenXAxis]) - 10);

    return circlesText;
}

// Function for updating circles when y-axis changes
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cy', d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Function for updating circle text when y-axis changes
function renderYCircleText(circlesText, newYScale, chosenYAxis) {
    circlesText.transition()
        .duration(1000)
        .attr('y', d => newYScale(d[chosenYAxis]) +5);

    return circlesText;
}

// Function for updating circle tooltips when x-axis changes
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
    var xLabel = 'Median Age: ';
    var yLabel = 'Healthcare (%): ';

    if (chosenXAxis === 'income') {
        xLabel = 'Median Income: $';
    }
    else if (chosenXAxis === 'poverty') {
        xLabel = 'Poverty (%): ';
    }

    if (chosenYAxis === 'obesity') {
        yLabel = 'Obesity (%): ';
    }
    else if (chosenYAxis === 'smokes') {
        yLabel = 'Smokes (%): '
    }

    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data, this);
    })
        .on('mouseout', function(data, index) {
            toolTip.hide(data, this);
        });

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
    var yLinearScale = yScale(medData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes
    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis);

    // Append x-axis labels
    var xLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 20})`);
    
    var ageLabel = xLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('active', true)
        .text('Median Age');

    var incomeLabel = xLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .classed('inactive', true)
        .text('Median Income');

    var povertyLabel = xLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'poverty')
        .classed('inactive', true)
        .text('Poverty (%)');

    // Append y-axis labels
    var yLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${0 - margin.left}, ${height / 2}) rotate(-90)`);
    
    var healthcareLabel = yLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 10)
        .attr('dy', '1em')
        .attr('value', 'healthcare')
        .classed('active', true)
        .text('Healthcare (%)');

    var obesityLabel = yLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 30)
        .attr('dy', '1em')
        .attr('value', 'obesity')
        .classed('inactive', true)
        .text('Obesity (%)');

    var smokesLabel = yLabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 50)
        .attr('dy', '1em')
        .attr('value', 'smokes')
        .classed('inactive', true)
        .text('Smokes (%)');


    // Append Circles of Data
    var circlesGroup = chartGroup.selectAll('circle')
        .data(medData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', 20)
        .attr('fill', 'slateblue')
        .attr('opacity', .5);

    var circlesText = chartGroup.selectAll('text').select('.circleText')
        .data(medData)
        .enter()    
        .append('text')
        .attr('x', d => xLinearScale(d[chosenXAxis]) - 10)
        .attr('y', d => yLinearScale(d[chosenYAxis]) + 5)
        .attr('fill', 'white')
        .classed('circleText', true)
        .text(d => d.abbr);

    var circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

    // Event Handler for x-axis
    xLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value != chosenXAxis) {
                chosenXAxis = value;

                xLinearScale = xScale(medData, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesText = renderXCircleText(circlesText, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

                if (chosenXAxis === 'age') {
                    ageLabel.classed('active', true)
                        .classed('inactive', false);
                    incomeLabel.classed('active', false)
                        .classed('inactive', true);
                    povertyLabel.classed('active', false)
                        .classed('inactive', true);
                }
                else if (chosenXAxis === 'income') {
                    ageLabel.classed('active', false)
                        .classed('inactive', true);
                    incomeLabel.classed('active', true)
                        .classed('inactive', false);
                    povertyLabel.classed('active', false)
                        .classed('inactive', true);
                }
                else if (chosenXAxis === 'poverty') {
                    ageLabel.classed('active', false)
                        .classed('inactive', true);
                    incomeLabel.classed('active', false)
                        .classed('inactive', true);
                    povertyLabel.classed('active', true)
                        .classed('inactive', false);
                }
            }
        })

    // Event Handler for y-axis
    yLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value != chosenYAxis) {
                chosenYAxis = value;

                yLinearScale = yScale(medData, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                circlesText = renderYCircleText(circlesText, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

                if (chosenYAxis === 'healthcare') {
                    healthcareLabel.classed('active', true)
                        .classed('inactive', false);
                    obesityLabel.classed('active', false)
                        .classed('inactive', true);
                    smokesLabel.classed('active', false)
                        .classed('inactive', true);
                }
                else if (chosenYAxis === 'obesity') {
                    healthcareLabel.classed('active', false)
                        .classed('inactive', true);
                    obesityLabel.classed('active', true)
                        .classed('inactive', false);
                    smokesLabel.classed('active', false)
                        .classed('inactive', true);
                }
                else if (chosenYAxis === 'smokes') {
                    healthcareLabel.classed('active', false)
                        .classed('inactive', true);
                    obesityLabel.classed('active', false)
                        .classed('inactive', true);
                    smokesLabel.classed('active', true)
                        .classed('inactive', false);
                }
            }
        })

});