/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25, 16];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };


class ScatterPlot {
	/* your code here */
	constructor(svg_id, data) {
		this.data = data;
		this.svg = d3.select('#' + svg_id);

		//console.log(this.svg);

		this.plot = this.svg.append('g')
							.attr('x', 10)
							.attr('y', 10);
		
		// Transform original x & y values to plot range
		const x_range = [d3.min(data, d => d.x), d3.max(data, d => d.x)];
		const y_range = [0, d3.max(data, d => d.y)];

		const x_to_svg = d3.scaleLinear()
						   .domain(x_range)
						   .range([0, 200]);

		const y_to_svg = d3.scaleLinear()
						   .domain(y_range)
						   .range([100, 0]);
		
		// Create rectangle block for the plot
		this.plot.append('rect')
			.classed('rect-background', true)
			.attr('width', 200)
			.attr('height', 100);
		
		// Create circle for data points
		this.plot.selectAll('circle')
		    .data(data)
			.enter().append('circle')
			.classed('warm', d => d.y >= 23)
			.classed('cold', d => d.y <= 17)
			.attr("cx", d => x_to_svg(d.x))
			.attr("cy", d => y_to_svg(d.y))
			.attr("r", 2);

		// Create X labels (Name of Day)
		this.svg.append('g')
			.selectAll('text')
			.data(data)
			.enter().append('text')
			.text(d => d.name)
			.attr('x', d => x_to_svg(d.x))
			.attr('y', 106);

		// Create Y labels (Temperature)
		const y_label = Array.from(Array(6), (v, k) => k * 20);
		this.svg.append('g')
			.selectAll('text')
			.data(y_label)
			.enter().append('text')
			.text(d => y_to_svg.invert(d).toFixed(1))
			.attr('x', -6)
			.attr('y', d => d);
		
	}
}

whenDocumentLoaded(() => {
	// prepare the data here
	let d3_data = TEST_TEMPERATURES.map((value, idx) => {
		return {'x': idx, 'y': value, 'name': DAYS[idx]};
	});

	console.log(d3_data);

	const plot = new ScatterPlot('plot', d3_data);
});

