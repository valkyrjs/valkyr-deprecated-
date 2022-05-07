import { Component } from "@angular/core";
import { TitleService } from "src/app/Application/Services/TitleService";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent {
  constructor(title: TitleService) {
    title.set("Todos");
  }
}
