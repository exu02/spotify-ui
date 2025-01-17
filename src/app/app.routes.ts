import { Routes } from '@angular/router';
import { UserSearchComponent } from './user-search/user-search.component';
import { PlaylistViewComponent } from './playlist-view/playlist-view.component';
import { TestPageComponent } from './test-page/test-page.component';

export const routes: Routes = [
    // { path: '', component:UserSearchComponent },
    { path: '', component:TestPageComponent },
    { path: 'playlist-view', component:PlaylistViewComponent }
];
