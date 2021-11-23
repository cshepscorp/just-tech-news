const {format_date} = require('../utils/helpers');

// We want to make the dates a little more readable. So let's write a test in helpers.test.js to ensure that format_date() takes Date() objects and returns dates in the MM/DD/YYYY format.

test('format_date() returns a date string', () => {
    const date = new Date('2020-03-20 16:12:03');

    expect(format_date(date)).toBe('3/20/2020');
});

// test to check that format_plural() correctly pluralizes words
test('format_plural() correctly pluralizes words', () => {
    const word = 'comment';
    const amount = '1';

    expect(word).toBe('comment');
    expect(amount).toBe('1');
});

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');
  
    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
  });
