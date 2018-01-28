import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ExcelComponent } from './excel/excel.component';
import { CellComponent } from './cell/cell.component';
import { SpreadsheetService } from "./spreadsheet.service";

@NgModule({
  declarations: [
    AppComponent,
    ExcelComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SpreadsheetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
