import { Injectable, OnInit } from '@angular/core';
import { StateService } from './state.service';

/*
Handles undo/redo and saving/loading to server
*/

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  private saveID?: string;

  constructor(private stateService: StateService) { }
  

  private generateRandomID(length: number = 64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

  test(): void {

      const params = new URLSearchParams(window.location.search);

      console.log("Path:", params.get("save"));
  }

  setSaveID(saveID: string | undefined) {
    this.saveID = saveID;
    const baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    const url = new URL(baseUrl);
    if (this.saveID !== undefined) url.searchParams.set('save', this.saveID);
    history.pushState({}, '', url);
    console.log("set url", url.toString());
  }


  save() {
    const data = this.stateService.getGraph().serialize();

    // not saved in server yet. generate new save ID
    if (this.saveID === undefined) {
      this.setSaveID(this.generateRandomID());

    }

    const request = {saveID: this.saveID, data: data};

    // send data to server
    fetch('/api/save/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    console.log("SaveService.save", request);

  }

  async load() {
    const params = new URLSearchParams(window.location.search);
    const saveID = params.get("save");

    if (saveID === null) {
      console.log("SaveService.load: no saveID");
      return;
    }

    console.log("SaveService.load", saveID);

    // send request to server
    const response = await fetch('/api/load/?' + new URLSearchParams({saveID: saveID}), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.status !== 200) {
      console.log("Invalid save ID");
      this.setSaveID(undefined);
      return;
    }

    const data = await response.json();
    
    console.log("SaveService.load: data", data);
    this.stateService.getGraph().deserialize(data);
    this.saveID = saveID;

  }

  
}
