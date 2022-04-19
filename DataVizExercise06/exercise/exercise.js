
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

const findMax = (array) => {
	return array.reduce((prev, curr) => Math.max(prev, curr), array[0]);
};

class ImageHistogram {
	initImage() {
		this.canvas = document.querySelector('#' + this.figure_element_id + ' canvas');
		console.log(this.canvas)
		this.canvas_context = this.canvas.getContext("2d");

		const image = new Image;
		image.onload = () => {
			this.canvas.width = image.width;
			this.canvas.height = image.height;
			this.canvas_context.drawImage(image, 0, 0);
		};
		image.src = "epfl-rolex.jpg";
	}

	/*
		Calculate the histogram of pixel values inside the specified area
		Returns an array [values_red, values_green, alues_blue]
		such that values_red[r] = number of pixels in the area which have the red value exactly equal to r
	*/
	getImageHistogramOfArea(x_left, y_top, width, height) {
		// getImageData:
		//	https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
		// returns an ImageData
		//	https://developer.mozilla.org/en-US/docs/Web/API/ImageData
		// we use the .data property which is a uint8 array
		//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
		const image_bytes = this.canvas_context.getImageData(x_left, y_top, width, height).data;

		// To make a histogram, for each color we count how many pixels
		// had a given value
		let counts = [
			new Array(256).fill(0),
			new Array(256).fill(0),
			new Array(256).fill(0),
		];

		// The bytes are arranged as follows: RGBARGBARGBA
		// so to get to the next pixel we add +4 to our index
		for(let idx = 0; idx < image_bytes.length; idx += 4) {
			// pixel color:
			// r = image_bytes[idx], g = image_bytes[idx+1], b = image_bytes[idx+2], a = image_bytes[idx+3]
			counts[0][image_bytes[idx]] += 1;
			counts[1][image_bytes[idx+1]] += 1;
			counts[2][image_bytes[idx+2]] += 1;
		}

		return counts;
	}

	updateSelected(selection) {
		// Update color histogram for the selected region
		if(selection) {
			const x_left = selection[0];
			const y_right = selection[1];
			const width = y_right[0] - x_left[0];
			const height = y_right[1] - x_left[1];

			const rgb_count = this.getImageHistogramOfArea(x_left[0], x_left[1], width, height);

			// Adapt to calculated histogram
			const max = findMax(rgb_count.map(findMax))
			this.scaleY.domain([0, max]);

			// Write color counts to histogram array
			for (let i = 0; i < 256; i++) {
				this.hist_data[0][i] = rgb_count[0][i];
				this.hist_data[1][i] = rgb_count[1][i];
				this.hist_data[2][i] = rgb_count[2][i];
			}
		
			this.curve.attr("d", this.curve_generator)
		}

		// Return NULL if nothing selected
		else {
			return this.curve.attr("d", "");
		}
	}
	
	constructor(figure_element_id) {
		this.figure_element_id = figure_element_id;
		this.svg = d3.select('#' + figure_element_id + ' svg');
		console.log(this.svg);

		this.initImage();

		this.plot_area = this.svg.append('g')
			.attr('x', 0)
			.attr('y', 0);
		
		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		console.log('viewBox', svg_viewbox);

		// Scales
		this.scaleX = d3.scaleLinear()
		                .domain([0, 255])
						.range([0, svg_viewbox.width]);
		
		this.scaleY = d3.scaleLinear()
		                .range([svg_viewbox.height, 0]);

		// Curve generator
		this.curve_generator = d3.area()
								 .curve(d3.curveBasis)
								 .x((value, i) => this.scaleX(i))
								 .y((value, j) => this.scaleY(value))
								 .y1(svg_viewbox.height + 1);
		
		// Data and curves
		this.hist_data = [
			new Array(256).fill(0),
			new Array(256).fill(0),
			new Array(256).fill(0),
		];

		this.curve = this.plot_area.selectAll('path')
								   .data(this.hist_data)
								   .enter()
								   .append('path')
								   .attr("class", (data, idx) => ['red', 'green', 'blue'][idx])
		
		// Brush
		const brush = d3.brush().on("end", () => {
			const selection = d3.event.selection;
			this.updateSelected(selection)
		})

		// Brush visual representation
		this.plot_area.append("g")
		              .attr("class", "brush")
					  .call(brush);

	}
}

whenDocumentLoaded(() => {
	plot_object = new ImageHistogram('fig-histogram');
	// plot object is global, you can inspect it in the dev-console
});
