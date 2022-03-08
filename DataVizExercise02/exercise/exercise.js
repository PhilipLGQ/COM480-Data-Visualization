
/*
## Functions and iteration
To implement:

* isEven(value)
* apply isEven on [1, 2, 3, 4, 5]
* filter [1, 2, 3, 4, 5] by isEven

*/

function isEven(value){
	return value % 2 === 0;
}

const arr = [1, 2, 3, 4, 5]
const even_arr = arr.filter(isEven)
// console.log(even_arr)


/*
### multiply
To implement:
* multiply, a function that accepts arbitrary number of parameters
* find a product of the following numbers: 1,2,3,4,5
* multiply(1,2,3,4,5) should return 120
*/

function multiply(...args){
	const prod = args.reduce((prev, current) => prev * current, 1);
	return prod;
}

// console.log(multiply(...number))

/*
## Closures

### divisibleBy
To implement:
* divisibleBy
* filter [0, 1, 2, 3, 4, 5, 6] by divisibleBy(3)
*/

function divisibleBy_closure(divisor){
	function divisible(x){
		if (x % divisor == 0){
			return true;
		}
		return false;
	}
	return divisible;
}

function divisibleBy_arrow(divisor){
	let func = (x) => {
		if (x % divisor == 0){
			return true;
		}
		return false;
	}
	return func;
}

/*
### increment
To implement:
* increment
* initial value is 100, step size is 2
*/

function increment(init=0){
	return function step(size=1){
		return init + size;
	}	
}


/*
### colorCycle
To implement:
colorCycle(colors=COLOR_CYCLE_DEFAULT)
*/

const COLOR_CYCLE_DEFAULT = ['red', 'green', 'magenta', 'blue'];

function colorCycle(colors=COLOR_CYCLE_DEFAULT){
	let color_idx = -1
	return () => {
		color_idx = (color_idx + 1) % colors.length;
		return colors[color_idx];
	}
}

const cc_r_g = colorCycle(['red', 'green']);
// This is a way to run 10 times, see the task about `range` below.
console.log('cycle red/green', Array.from(Array(10), cc_r_g));

const cc1 = colorCycle();
const cc2 = colorCycle();
console.log('cycle default', [cc1(), cc1(), cc2(), cc2(), cc1()]);

const my_cc = colorCycle(['purple', 'rgb(20, 230, 220)', 'rgb(10, 230, 20)', 'rgb(230, 20, 10)']);
showColorCycle(my_cc);

/*
## Range

To implement:
* range
* filter range(100) by divisibility by 13
*/

function range_iter(N){
	let arr = [];
	for (let i = 0; i < N; i++){
		arr.push(i);
	}
	return arr;
}

function range_noniter(N){
	const arr = Array.from(Array(N), (v, i) => i);
	return arr;
}

console.log('range(10)', range_noniter(10));
// Expeceted result:
// [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

console.log('range(100) and divisibleBy(13)', 
			range_noniter(100).filter(divisibleBy_arrow(13)))


/*
To implement:
* Implement a function `randomInRange(min_val=0, max_val=100)` which returns a random float value between `min_val` and `max_val`.

* Implement a function `randomArray(N, min_val=0, max_val=100)` which generates an array of `N` random values between `min_val` and `max_val`.

*/

function randomInRange(min_val=0, max_val=100){
	return Math.random() * (max_val - min_val) + min_val
}

function randomArray(N, min_val=0, max_val=100){
	return Array.from(Array(N), () => randomInRange(min_val, max_val))
}

console.log('randomArray', randomArray(5, 0, 10));

/*
## Counting

* Create a function `countOccurrences(string)` which counts the number of occurrences of each letter in a string.
	For example `countOccurrences("hello")` yields `{'h': 1, 'e': 1, 'l': 2, 'o': 1 }`.
*/

function countOccurrences(str){
	count = {}
	let arr = Array.from(str);
	arr.forEach(element => {
		count[element] = (count[element] || 0) + 1;
	});
	return count;
}

console.log(countOccurrences('hello'));
// Expected result:
// countOccurrences("hello") ---> {'h': 1, 'e': 1, 'l': 2, 'o': 1 }

/*
* Create the function `normalizeCounts` which takes the character counts outputted by `countOccurrences`,
	and calculates normalized counts - that is divided by the total sum.
	Please calculate the sum using [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).
	For example:
	`normalizeCounts({'h': 1, 'e': 1, 'l': 2, 'o': 1})` yields `{'h': 0.2, 'e': 0.2, 'l': 0.4, 'o': 0.2}`

* Create `countOccurencesNormalized` - a function which given a string, first applies `countOccurrences` and then normalizes the counts using `normalizeCounts`.

* Visualize the results by calling `setCharacterCountingFunction(countOccurencesNormalized);` - look at `index.html`, now you should be able to count the distribution
of characters in any text you input. You can pass a `colorCycle` with your colors as the second argument to color the bars.
*/

function normalizeCounts(counts){
	// Calculate sum of all characters
	const char_count = Object.values(counts).reduce((prev, curr) => prev + curr);

	// Normalize the occurrences by this sum
	let n_count = {};
	Object.entries(counts).forEach((arr_key_value) => {
		n_count[arr_key_value[0]] = arr_key_value[1] / char_count;
	});
	return n_count;
}

const countOccurencesNormalized = (str) => normalizeCounts(countOccurrences(str));

console.log(normalizeCounts(countOccurrences('hello')));
// Expected result:
// normalizeCounts({'h': 1, 'e': 1, 'l': 2, 'o': 1 }) ---> {'h': 0.2, 'e': 0.2, 'l': 0.4, 'o': 0.2 }

setCharacterCountingFunction(
	countOccurencesNormalized,
	colorCycle(['rgb(20, 230, 220)', 'rgb(10, 230, 20)'])
);


/*
## Throwing balls

We will simulate a ball thrown at angle $b$ with velocity $v_0$. The initial velocity $(v_x, v_y)$ is:

$$v_x = v_0 cos(b)$$
$$v_y = v_0 sin(b)$$

The position of the ball at time $t$ is given by:

$$x(t) = v_x * t$$
$$y(t) = v_y * t + (a * t^2 * 0.5)$$

where $a$ is the acceleration caused by gravity, usually -9.81 $m/s^2$.

Implement a function `simulateBall(v0, angle, num_steps, dt, g)` such that:

* `v0` is the magnitude of the initial velocity
* 'angle' is the inclination angle in degrees, multiply by `DEG_TO_RAD = Math.PI / 180.` to get radians for the trigonometric functions,
* `num_steps` is the number of steps of the simulation, the default value should be 256,
* `dt` is the time that advances between steps, default value 0.05,
* `g` is the acceleration, default value -9.81,
* it returns an array of ball positions at each time step,
* each position is given as a array `[x, y]`,

Use the `range` function to create the array of time points, then `map` them to the `[x, y]` values given by the equations above.
* We want to finish the plot when the ball hits the ground (y=0), so please filter the point array to remove points with y below 0.
* Visualize the ball trajectories using `plotBall` (the 2nd optional argument is the line color):
* Use `randomArray` to create 20 random angles between 0 deg and 90 deg, then plot the ball trajectories for each angle.
*/

const DEG_TO_RAD = Math.PI / 180.;

function simulateBall(v0, angle, num_steps=256, dt=0.05, g=-9.81){
	const rad_angle = angle * DEG_TO_RAD;
	const vx = v0 * Math.cos(rad_angle);
	const vy = v0 * Math.sin(rad_angle);

	const position = range_noniter(num_steps).map((i) => {
		const t_idx = i * dt;
		return [vx * t_idx, vy * t_idx + 0.5 * g * t_idx * t_idx];
	});
	return position.filter((pos) => pos[1] >= 0);
}

const ball_cc = colorCycle(['hsl(160, 100%, 64%)', 'hsl(200, 100%, 64%)', 'hsl(240, 100%, 64%)', 'hsl(120, 100%, 64%)', 'hsl(80, 100%, 64%)']);
plotBall(simulateBall(40, 60), ball_cc());
plotBall(simulateBall(40, 30), ball_cc());
plotBall(simulateBall(40, 45), ball_cc());

randomArray(20, 0, 90).forEach((angle) => {
	plotBall(simulateBall(40, angle), ball_cc());
})