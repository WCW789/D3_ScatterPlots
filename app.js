function makeResponsive() {
    let svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    let svgHeight = window.innerHeight;
    let svgWidth = window.innerWidth * .9;

    let margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 90
    };

    let height = svgHeight - margin.top - margin.bottom;
    let width = svgWidth - margin.left - margin.right;

    let svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let chosenXAxis = "age";
    let chosenYAxis = "smokes";

    function xScale(ageData, chosenXAxis) {
        let xLinearScale = d3.scaleLinear()
            .domain([d3.min(ageData, d => d[chosenXAxis]) * 0.8,
            d3.max(ageData, d => d[chosenXAxis]) * 1.1
            ])
            .range([0, width]);

        return xLinearScale;
    }

    function yScale(smokeData, chosenYAxis) {
        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(smokeData, d => d[chosenYAxis])])
            .range([height, 0]);

        return yLinearScale;
    }

    function renderXAxes(newXScale, xAxis) {
        let bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    function renderYAxes(newYScale, yAxis) {
        let leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    function renderCircles(circlesGroup, newXScale, chosenXaxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("x", d => newXScale(d[chosenXAxis]) - 10)

        return circlesGroup;
    }

    function renderCircles2(circlesGroup, newYScale, chosenYaxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newYScale(d[chosenYAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]) + 5)

        return circlesGroup;
    }

    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        console.log("1", chosenXAxis)
        console.log("2", chosenYAxis)

        if (chosenXAxis === "age" && chosenYAxis === "smokes") {
            xlabel = "Age:"
            ylabel = "Smokes:"
        }
        else if (chosenXAxis === "healthcare" && chosenYAxis === "smokes") {
            xlabel = "Healthcare:"
            ylabel = "Smokes:"
        }
        else if (chosenXAxis === "obesity" && chosenYAxis === "smokes") {
            xlabel = "Obesity:"
            ylabel = "Smokes:"
        }
        else if (chosenXAxis === "age" && chosenYAxis === "income") {
            xlabel = "Age:"
            ylabel = "Income:"
        }
        else if (chosenXAxis === "healthcare" && chosenYAxis === "income") {
            xlabel = "Healthcare:"
            ylabel = "Income:"
        }
        else if (chosenXAxis === "obesity" && chosenYAxis === "income") {
            xlabel = "Obesity:"
            ylabel = "Income:"
        }
        else if (chosenXAxis === "age" && chosenYAxis === "poverty") {
            xlabel = "Age:"
            ylabel = "Poverty:"
        }
        else if (chosenXAxis === "healthcare" && chosenYAxis === "poverty") {
            xlabel = "Healthcare:"
            ylabel = "Poverty:"
        }
        else if (chosenXAxis === "obesity" && chosenYAxis === "poverty") {
            xlabel = "Obesity:"
            ylabel = "Poverty:"
        }

        let toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([-10, 0])
            .html(function (d) {
                return (`<b>${d.state}</b><br><i>${xlabel}</i> ${d[chosenXAxis]}<br><i>${ylabel}</i> ${d[chosenYAxis]}`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data, this);
        })
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        return circlesGroup;
    }

    console.log("testing")

    d3.csv("data.csv", function (error, graphData) {
        if (error) return console.warn(error);

        graphData.forEach(function (data) {
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.obesity = +data.obesity;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });


        let xLinearScale = xScale(graphData, chosenXAxis);
        let yLinearScale = yScale(graphData, chosenYAxis);

        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        let xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        let yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        let circlesGroup = chartGroup.selectAll("circle")
            .data(graphData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 12)
            .attr("fill", "Aquamarine")

        console.log("circles", circlesGroup)

        let circlesGroup2 = chartGroup.selectAll("circle")
            .select("text")
            .data(graphData)
            .enter()
            .append("text")
            .text(function (d) {
                return d.abbr
            })
            .attr("x", d => xLinearScale(d[chosenXAxis]) - 10)
            .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)


        let labelsGroup1 = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        let ageLabel = labelsGroup1.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "age")
            .classed("active", true)
            .text("Age");

        let obLabel = labelsGroup1.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obesity - %");

        let hcLabel = labelsGroup1.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "healthcare")
            .classed("inactive", true)
            .text("Healthcare - %");

        let labelsGroup2 = chartGroup.append("g")

        let smokeLabel = labelsGroup2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "3.25em")
            .attr("value", "smokes")
            .classed("active", true)
            .text("Smokes - %");

        let incomeLabel = labelsGroup2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "2.25em")
            .attr("value", "income")
            .classed("inactive", true)
            .text("Income Amount");

        let poLabel = labelsGroup2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("value", "poverty")
            .classed("inactive", true)
            .text("Poverty - %");

        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        labelsGroup1.selectAll("text")
            .on("click", function () {
                let value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {
                    chosenXAxis = value;

                    console.log(chosenXAxis)

                    xLinearScale = xScale(graphData, chosenXAxis);
                    xAxis = renderXAxes(xLinearScale, xAxis);
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                    circlesGroup2 = renderCircles(circlesGroup2, xLinearScale, chosenXAxis);
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    if (chosenXAxis === "age") {
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        hcLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "obesity") {
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        hcLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "healthcare") {
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        hcLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });

        labelsGroup2.selectAll("text")
            .on("click", function () {
                let value1 = d3.select(this).attr("value");
                if (value1 !== chosenYAxis) {
                    chosenYAxis = value1;

                    yLinearScale = yScale(graphData, chosenYAxis);
                    yAxis = renderYAxes(yLinearScale, yAxis);
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                    circlesGroup = renderCircles2(circlesGroup, yLinearScale, chosenYAxis);
                    circlesGroup2 = renderCircles2(circlesGroup2, yLinearScale, chosenYAxis);


                    if (chosenYAxis === "smokes") {
                        smokeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        poLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "income") {
                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        poLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "poverty") {
                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        poLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });
    })
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);
