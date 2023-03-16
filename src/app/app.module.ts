import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {CdkListboxModule} from '@angular/cdk/listbox';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from '@angular/forms';
import { ReceipeListComponent } from './receipe-list/receipe-list.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from "@angular/forms";
import { CategoriesComponent } from './categories/categories.component';
import { YourRecipeListComponent } from './your-recipe-list/your-recipe-list.component';
import { AddEditRecipeComponent } from './add-edit-recipe/add-edit-recipe.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from "@angular/material/core";
import { RecipeEntryComponent } from './recipe-entry/recipe-entry.component';
import { BeerListComponent } from './beer-list/beer-list.component';
import { BeerEntryComponent } from './beer-entry/beer-entry.component';
import { FavoritesComponent } from './favorites/favorites.component';
import {
	BarcodeScannerLivestreamModule,
	BarcodeScannerLivestreamOverlayModule
  } from "ngx-barcode-scanner";
import { BarcodeEntryComponent } from './barcode-entry/barcode-entry.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { FridgeComponent } from './fridge/fridge.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReceipeListComponent,
    CategoriesComponent,
    YourRecipeListComponent,
    AddEditRecipeComponent,
    RecipeEntryComponent,
    BeerListComponent,
    BeerEntryComponent,
    FavoritesComponent,
    BarcodeEntryComponent,
    HelpPageComponent,
    FridgeComponent,
  ],
  imports: [
	BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
	FlexLayoutModule,
	ReactiveFormsModule,
	HttpClientModule,
	MatGridListModule,
	MatToolbarModule,
    BarcodeScannerLivestreamModule,
    BarcodeScannerLivestreamOverlayModule,
	MatIconModule,
	MatButtonModule,
	CdkListboxModule,
	MatProgressSpinnerModule,
	MatButtonToggleModule,
	MatCardModule,
	MatInputModule,
	MatFormFieldModule,
	FormsModule,
	MatSidenavModule,
	MatListModule,
	MatTooltipModule
  ],
  providers: [
	{
		provide: ErrorStateMatcher,
		useClass: ShowOnDirtyErrorStateMatcher
	}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
