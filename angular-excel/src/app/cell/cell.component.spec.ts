import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from "@angular/forms";

import { CellComponent } from './cell.component';
import { SpreadsheetService } from "app/spreadsheet.service";

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;
  let service: SpreadsheetService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ SpreadsheetService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(SpreadsheetService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate with SpreadsheetService when formula value changes', fakeAsync(() => {
    const value = 'foo';
    spyOn(service, 'evaluate');

    component.formula.setValue(value);
    tick(500);

    expect(service.evaluate).toHaveBeenCalledWith(value);
  }));

  it('should expose evaluated result in value$', fakeAsync(() => {
    let currentValue;
    const result = 'bar';
    spyOn(service, 'evaluate').and.returnValue(result);

    component.value$.subscribe(value => currentValue = value);
    component.formula.setValue('foo');
    tick(500);

    expect(currentValue).toBe(result);
  }));
});
