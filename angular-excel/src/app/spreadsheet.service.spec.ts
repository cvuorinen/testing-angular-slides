import { Subject } from "rxjs";

import { SpreadsheetService } from './spreadsheet.service';

describe('SpreadsheetService', () => {
  let service: SpreadsheetService;

  beforeEach(() => {
    service = new SpreadsheetService();
  });

  it('should expose `update$` Subject', () => {
    expect(service.update$ instanceof Subject).toBeTruthy();
  });

  it('should evaluate expression', () => {
    const result = service.evaluate('1+1');

    expect(result).toEqual(2);
  });

  it('should return the expression when parsing fails', () => {
    const invalidExpression = '"foo';

    const result = service.evaluate(invalidExpression);

    expect(result).toEqual(invalidExpression);
  });

  it('should evaluate with reference to another cell', () => {
    service.update$.next({ id: 'A1', value: 2 });

    const result = service.evaluate('A1+2');

    expect(result).toEqual(4);
  });

  it('should evaluate with updated cell values', () => {
    const expression = 'A1+2';
    service.update$.next({ id: 'A1', value: 2 });

    const result1 = service.evaluate(expression);

    expect(result1).toEqual(4);

    service.update$.next({ id: 'A1', value: 7 });

    const result2 = service.evaluate(expression);

    expect(result2).toEqual(9);
  });

  it('should evaluate sum function', () => {
    service.update$.next({ id: 'A1', value: 2 });
    service.update$.next({ id: 'B1', value: 3 });

    const result = service.evaluate('sum(A1,B1,4)');

    expect(result).toEqual(9);
  });
});
