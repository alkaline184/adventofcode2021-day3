/*
--- Day 3: Binary Diagnostic ---
The submarine has been making some odd creaking noises, so you ask it to produce a diagnostic report just in case.

The diagnostic report (your puzzle input) consists of a list of binary numbers which, when decoded properly, can tell you many useful things about the conditions of the submarine. The first parameter to check is the power consumption.

You need to use the binary numbers in the diagnostic report to generate two new binary numbers (called the gamma rate and the epsilon rate). The power consumption can then be found by multiplying the gamma rate by the epsilon rate.

Each bit in the gamma rate can be determined by finding the most common bit in the corresponding position of all numbers in the diagnostic report. For example, given the following diagnostic report:

00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
Considering only the first bit of each number, there are five 0 bits and seven 1 bits. Since the most common bit is 1, the first bit of the gamma rate is 1.

The most common second bit of the numbers in the diagnostic report is 0, so the second bit of the gamma rate is 0.

The most common value of the third, fourth, and fifth bits are 1, 1, and 0, respectively, and so the final three bits of the gamma rate are 110.

So, the gamma rate is the binary number 10110, or 22 in decimal.

The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used. So, the epsilon rate is 01001, or 9 in decimal. Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, 198.

Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)

Your puzzle answer was 3374136.

--- Part Two ---
Next, you should verify the life support rating, which can be determined by multiplying the oxygen generator rating by the CO2 scrubber rating.

Both the oxygen generator rating and the CO2 scrubber rating are values that can be found in your diagnostic report - finding them is the tricky part. Both values are located using a similar process that involves filtering out values until only one remains. Before searching for either rating value, start with the full list of binary numbers from your diagnostic report and consider just the first bit of those numbers. Then:

Keep only numbers selected by the bit criteria for the type of rating value for which you are searching. Discard numbers which do not match the bit criteria.
If you only have one number left, stop; this is the rating value for which you are searching.
Otherwise, repeat the process, considering the next bit to the right.
The bit criteria depends on which type of rating value you want to find:

To find oxygen generator rating, determine the most common value (0 or 1) in the current bit position, and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 1 in the position being considered.
To find CO2 scrubber rating, determine the least common value (0 or 1) in the current bit position, and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 0 in the position being considered.
For example, to determine the oxygen generator rating value using the same example diagnostic report from above:

Start with all 12 numbers and consider only the first bit of each number. There are more 1 bits (7) than 0 bits (5), so keep only the 7 numbers with a 1 in the first position: 11110, 10110, 10111, 10101, 11100, 10000, and 11001.
Then, consider the second bit of the 7 remaining numbers: there are more 0 bits (4) than 1 bits (3), so keep only the 4 numbers with a 0 in the second position: 10110, 10111, 10101, and 10000.
In the third position, three of the four numbers have a 1, so keep those three: 10110, 10111, and 10101.
In the fourth position, two of the three numbers have a 1, so keep those two: 10110 and 10111.
In the fifth position, there are an equal number of 0 bits and 1 bits (one each). So, to find the oxygen generator rating, keep the number with a 1 in that position: 10111.
As there is only one number left, stop; the oxygen generator rating is 10111, or 23 in decimal.
Then, to determine the CO2 scrubber rating value from the same example above:

Start again with all 12 numbers and consider only the first bit of each number. There are fewer 0 bits (5) than 1 bits (7), so keep only the 5 numbers with a 0 in the first position: 00100, 01111, 00111, 00010, and 01010.
Then, consider the second bit of the 5 remaining numbers: there are fewer 1 bits (2) than 0 bits (3), so keep only the 2 numbers with a 1 in the second position: 01111 and 01010.
In the third position, there are an equal number of 0 bits and 1 bits (one each). So, to find the CO2 scrubber rating, keep the number with a 0 in that position: 01010.
As there is only one number left, stop; the CO2 scrubber rating is 01010, or 10 in decimal.
Finally, to find the life support rating, multiply the oxygen generator rating (23) by the CO2 scrubber rating (10) to get 230.

Use the binary numbers in your diagnostic report to calculate the oxygen generator rating and CO2 scrubber rating, then multiply them together. What is the life support rating of the submarine? (Be sure to represent your answer in decimal, not binary.)

*/
const fs = require('fs');

const inputs = fs.readFileSync("./input.txt").toString().split("\n");
const totalInputs = inputs.length;

const calculateOnesOrZeros = (arr) => {
    return arr.reduce((prev, current) => {
        current.split('').forEach((element, elIndex) => {
            if (element == 1) {
                prev[elIndex]++;
            }
        });
        return prev;
    }, Array(12).fill(0))
}

const buildResultingBinaryString = (arr, type = 'most') => {
    return arr.reduce((prev, current) => {
        if (type === 'most') {
            prev += (current > Math.floor(totalInputs / 2)) ? '1' : '0';
        } else {
            prev += (current < Math.floor(totalInputs / 2)) ? '1' : '0';
        }
        return prev;
    }, '');
}

const filterByMajority = (arr, index, type = 'most') => {
    // number of ones
    const ones = arr.reduce((prev, current) => {
        prev += (current.split('')[index] == 1) ? 1 : 0;
        return prev;
    }, 0);

    // find controlling digit
    let foundDigit;
    if (type === 'most') {
        foundDigit = (ones >= arr.length / 2) ? '1' : '0';
    } else {
        foundDigit = (ones < arr.length / 2) ? '1' : '0';
    }

    // filter list having controlling digit in the index place
    const filteredList = arr.filter((current) => {
        return current.split('')[index] === foundDigit;
    })

    // recurse until 1 is left
    if (filteredList.length === 1) {
        return filteredList;
    } else {
        return filterByMajority(filteredList, index + 1, type);
    }
}

// Day 3 - Part 1
const ones = calculateOnesOrZeros(inputs);
const gammaRateBinary = buildResultingBinaryString(ones);
const gammaRateDecimal = parseInt(gammaRateBinary, 2);

const epsilonRateBinary = buildResultingBinaryString(ones, 'least');
const epsilonRateDecimal = parseInt(epsilonRateBinary, 2);

const powerConsumption = gammaRateDecimal * epsilonRateDecimal;
console.log(powerConsumption);


// Day 3 - Part 2
const oxygenGeneratorRatingBinary = filterByMajority(inputs, 0);
const oxygenGeneratorRatingDecimal = parseInt(oxygenGeneratorRatingBinary, 2);

const co2ScrubberRatingBinary = filterByMajority(inputs, 0, 'least');
const co2ScrubberRatingDecimal = parseInt(co2ScrubberRatingBinary, 2);

const lifeSupportRating = oxygenGeneratorRatingDecimal * co2ScrubberRatingDecimal;
console.log(lifeSupportRating);


