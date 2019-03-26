const forTest = require('./forTest');

it ('should square the number', () => {
    let nn = 5;
    let sq = forTest.square(nn);
    if (nn * nn != sq) throw new Error(`Expected ${nn*nn}, but got ${sq}`);
});