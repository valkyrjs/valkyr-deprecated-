import { Component, OnInit } from "@angular/core";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { MenuService } from "@valkyr/angular";

import { menus } from "../../Workspace/Menu";

@Component({
  selector: "text-editor",
  templateUrl: "./Template.html"
})
export class TextEditorComponent implements OnInit {
  private editor?: Editor;

  constructor(private menu: MenuService) {}

  public ngOnInit(): void {
    this.menu.open(menus["sidebar"]);
    this.editor = new Editor({
      element: document.querySelector(".text-editor") || undefined,
      extensions: [StarterKit],
      content: "<p>Hello World!</p>"
    });
  }
}
