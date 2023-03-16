import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeAPI } from '../shared/services/RecipeAPI';
import { StabilityAPI } from '../shared/services/StabilityAPI';
import { RouterTestingModule } from '@angular/router/testing';
import { RecipeEntryComponent } from './recipe-entry.component';

describe('RecipeEntryComponent', () => {
  let component: RecipeEntryComponent;
  let fixture: ComponentFixture<RecipeEntryComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({});
    const recipeAPIStub = () => ({
      get_recipe: arg => ({ subscribe: f => f({}) })
    });
    const stabilityAPIStub = () => ({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RecipeEntryComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: RecipeAPI, useFactory: recipeAPIStub },
        { provide: StabilityAPI, useFactory: stabilityAPIStub }
      ]
    });
    fixture = TestBed.createComponent(RecipeEntryComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`imageText has default value`, () => {
    expect(component.imageText).toEqual(`data:image/png;base64, `);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const recipeAPIStub: RecipeAPI = fixture.debugElement.injector.get(
        RecipeAPI
      );
      spyOn(recipeAPIStub, 'get_recipe').and.callThrough();
      component.ngOnInit();
      expect(recipeAPIStub.get_recipe).toHaveBeenCalled();
    });
  });
});
