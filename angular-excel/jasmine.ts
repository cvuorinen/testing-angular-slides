
describe('Jasmine test suite', () => {

  beforeEach(() => {
    // instanciate Subject Under Test
    // setup dependencies
  });

  it('should test expectation', () => {
    // execute code that should be tested
    // and assert expectation
    expect(1 + 1).toEqual(2);
  });

  describe('nested specs', () => {
    // nested specs can also have beforeEach

    it('should test more specs', () => {
      // ...
      const result = 1 + 2 === 2;

      expect(result).not.toBe(true);
    });

  });

});
