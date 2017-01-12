import { Component, OnInit } from '@angular/core';
import { moConsole, moResourceManager, moIODeviceManager } from '../moldeojs'

@Component({
  selector: 'moldeojs-view',
  templateUrl: './moldeojs-view.component.html',
  styleUrls: ['./moldeojs-view.component.css']
})
export class MoldeojsViewComponent implements OnInit {
  message: string;
  m_Console: moConsole;
  m_ResourceManager: moResourceManager;
  m_IODeviceManager: moIODeviceManager;

  constructor() {
    console.log("<moldeojs-view/> MoldeojsViewComponent");
    this.message = "moldeojs initializing...";
    this.m_ResourceManager = new moResourceManager();
    this.m_IODeviceManager = new moIODeviceManager();
    this.m_Console = new moConsole();
    console.log(this.m_Console.name);
    this.message = this.m_Console.name;
    this.m_Console.Init();
  }

  ngOnInit() {
  }

}
