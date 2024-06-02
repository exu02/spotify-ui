import { Routes } from '@angular/router';
import { UserSearchComponent } from './user-search/user-search.component';
import { PlaylistViewComponent } from './playlist-view/playlist-view.component';

export const routes: Routes = [
    { path: '', component:UserSearchComponent },
    { path: 'playlist-view', component:PlaylistViewComponent }
];
