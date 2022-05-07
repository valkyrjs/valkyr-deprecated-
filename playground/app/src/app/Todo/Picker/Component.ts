import { Component, OnInit } from "@angular/core";
import { TitleService } from "src/app/Application/Services/TitleService";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent implements OnInit {
  constructor(private title: TitleService) {}

  public ngOnInit() {
    this.title.set("Todos");
  }
}
