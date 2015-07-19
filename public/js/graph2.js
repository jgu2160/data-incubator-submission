var data = [[4593, 0.000022], [6382, 0.00000012], [4742,0.0000018]];

    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[0]; })])
              .range([ 0, width ]);

    var y = d3.scale.linear()
    	      .domain([0, d3.max(data, function(d) { return d[1]; })])
    	      .range([ height, 0 ]);

    var chart = d3.select('.graph2')
	.append('svg:svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.attr('class', 'chart');

    var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main');

    // draw the x axis
    var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

    main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
    .ticks(10, "%");

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis)
    .append("text")
      .attr("y", 450)
      .attr("x", 525)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("(Lower is better)");


    var g = main.append("svg:g");

    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 8);
