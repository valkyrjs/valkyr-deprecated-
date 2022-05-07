import { Component } from "@angular/core";
import { TitleService } from "@valkyr/angular";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent {
  constructor(title: TitleService) {
    title.set("Todos", "application");
  }
}
