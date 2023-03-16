import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { AddEditRecipeComponent } from './add-edit-recipe.component';

describe('AddEditRecipeComponent', () => {
  let component: AddEditRecipeComponent;
  let fixture: ComponentFixture<AddEditRecipeComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({
      group: object => ({}),
      array: (array, object) => ({})
    });
    const locationStub = () => ({ back: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddEditRecipeComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Location, useFactory: locationStub }
      ]
    });
    fixture = TestBed.createComponent(AddEditRecipeComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
