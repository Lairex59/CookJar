import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditRecipeComponent } from "./add-edit-recipe/add-edit-recipe.component";
import { CategoriesComponent } from "./categories/categories.component";
import { HomeComponent } from "./home/home.component";
import { ReceipeListComponent } from "./receipe-list/receipe-list.component";
import { YourRecipeListComponent } from './your-recipe-list/your-recipe-list.component';
import { RecipeEntryComponent } from './recipe-entry/recipe-entry.component';
import { BeerListComponent } from './beer-list/beer-list.component';
import { BeerEntryComponent } from './beer-entry/beer-entry.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BarcodeEntryComponent } from './barcode-entry/barcode-entry.component';
import { HelpPageComponent } from "./help-page/help-page.component";
import { FridgeComponent } from "./fridge/fridge.component";

const routes: Routes = [
	{ path: "", redirectTo: "/home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "recipeList", component: ReceipeListComponent },
	{ path: "beer", component: BeerListComponent },
	{ path: "beerEntry/:id", component: BeerEntryComponent },
	{ path: "categories", component: CategoriesComponent },
	{ path: "barcode/:id", component: BarcodeEntryComponent },
	{ path: "yourRecipeList", component: YourRecipeListComponent },
	{ path: "yourRecipeList/addEditRecipe/:id", component: AddEditRecipeComponent },
	{ path: "yourRecipeList/addEditRecipe", component: AddEditRecipeComponent },
	{ path: "recipeEntry/:id/:lang", component: RecipeEntryComponent },
	{ path: "favorites", component: FavoritesComponent },
	{ path: "fridge", component: FridgeComponent },
	{ path: "help", component: HelpPageComponent },
	{ path: "**", redirectTo: "/home"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
