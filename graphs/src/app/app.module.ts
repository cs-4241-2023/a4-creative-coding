import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';


import { AppComponent } from './app.component';
import { SvgComponent } from './components/svg/svg.component';
import { GridLinesComponent } from './components/grid-lines/grid-lines.component';
import { GraphComponent } from './components/graph/graph.component';
import { NodeComponent } from './components/node/node.component';
import { EdgeComponent } from './components/edge/edge.component';
import { InteractionDirective } from './directives/interaction-behavior';
import { DebugComponent } from './components/debug/debug.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { NewNodeLineComponent } from './components/new-node-line/new-node-line.component';
import { EditPanelComponent } from './components/edit-panel/edit-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgComponent,
    GridLinesComponent,
    GraphComponent,
    NodeComponent,
    EdgeComponent,
    InteractionDirective,
    DebugComponent,
    ContextMenuComponent,
    NewNodeLineComponent,
    EditPanelComponent,
  ],
  imports: [
    BrowserModule,
    MatMenuModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
