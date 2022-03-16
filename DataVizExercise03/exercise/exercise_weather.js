
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


// Part 1 - DOM
function showTemperatures(container_element, temperature_array){
	// Clear container element's content
	container_element.innerHTML = "";

	// Functional iterattion for temperatures
	temperature_array.forEach((temp_value) => {
		// Create a "p" element
		const elem = document.createElement("p");

		// Set temperature value to element
		elem.textContent = temp_value.toString();

		// Set color for "warm"/"cold"
		if (temp_value <= 17){
			elem.classList.add("cold");
		}
		else if (temp_value >= 23){
			elem.classList.add("warm");
		}

		// Add the element to the container
		container_element.appendChild(elem);
	});
}

whenDocumentLoaded(() => {
	// Part 1.1: Find the button + on click event
	const button = document.getElementById('btn-part1');
	button.addEventListener('click', () => {
		console.log('The button was clicked!');
	});

	// Part 1.2: Write temperatures
	const output = document.getElementById('weather-part1');
	button.addEventListener('click', () => {
		showTemperatures(output, TEST_TEMPERATURES);
	});
});

// Part 2 - class

class Forecast {
	constructor(container){
		this.container = container;
		this.temparature = [1, 2, 3, 4, 5, 6, 7];
	}

	toString() {
		// Write attributes to a string
		const str = "Forecast(temparature=" + this.temparature.toString()
					+ ", container=" + this.container.toString() + ")";
		return str;
	}

	print() {
		// Print the string to the console
		console.log(this.toString());
	}

	show() {
		// Clear container element's content
		this.container.innerHTML = "";

		// Functional iterattion for temperatures
		this.temparature.forEach((temp_value) => {
		// Create a "p" element
			const elem = document.createElement("p");

		// Set temperature value to element
			elem.textContent = temp_value.toString();

		// Set color for "warm"/"cold"
			if (temp_value <= 17){
				elem.classList.add("cold");
			}
			else if (temp_value >= 23){
				elem.classList.add("warm");
			}

		// Add the element to the container
			this.container.appendChild(elem);
		});
	}

	reload() {
		this.temparature = TEST_TEMPERATURES;
		this.show();
	}
}

whenDocumentLoaded(() => {
	const button = document.getElementById('btn-part1');
	const output_container = document.getElementById('weather-part2');
	const forecast = new Forecast(output_container);

	button.addEventListener('click', () => {
		forecast.reload();
	});
});

// Part 3 - fetch

const QUERY_LAUSANNE = 'http://api.weatherbit.io/v2.0/forecast/daily?city=Lausanne&days=7&key=4c94cbff6b33443ebf71abc7cd557a9e';

function weatherbitToTemperatures(data) {
	const temp = data['data'].map(day_data => {
		return ((day_data['high_temp'] + day_data['low_temp']) / 2).toFixed(1);
	});
	return temp;
}

class ForecastOnline extends Forecast {
	reload(){
		// this.temparature = [2, 3, 4, 5, 6, 7, 8];

		fetch(QUERY_LAUSANNE)
			.then(response => response.json())
			.then(data => {
				this.temparature = weatherbitToTemperatures(data);
				//console.log('Tempature Data:', data);
			})
			.then(() => this.show());
	}
}

whenDocumentLoaded(() => {
	const button = document.getElementById('btn-part1');

	const forecast2 = new ForecastOnline(document.getElementById('weather-part3'));

	button.addEventListener('click', () => {
		forecast2.reload();
	});
});

// Part 4 - interactive
class ForecastOnlineCity extends ForecastOnline {
	setCity(city_name) {
		this.city = city_name;
	}

	reload() {
		const url = 'http://api.weatherbit.io/v2.0/forecast/daily?city=' + this.city + '&days=7&key=4c94cbff6b33443ebf71abc7cd557a9e';

		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.temparature = weatherbitToTemperatures(data);
				this.city = data['city_name'];
			})
			.then(() => this.show());
	}

	show() {
		super.show();
		const elem = document.createElement('h4');
		elem.textContent = this.city;

		this.container.insertBefore(elem, this.container.children[0]);
	}
}

whenDocumentLoaded(() => {
	const input_city = document.getElementById('query-city');
	const button_city = document.getElementById('btn-city');

	const forecast_city = new ForecastOnlineCity(document.getElementById('weather-city'));

	button_city.addEventListener('click', () => {
		const city = input_city.value;

		forecast_city.setCity(city);
		forecast_city.reload();
	});
});