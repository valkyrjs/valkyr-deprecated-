import { Component, OnInit } from "@angular/core";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

@Component({
  selector: "text-editor",
  templateUrl: "./Template.html"
})
export class TextEditorComponent implements OnInit {
  private editor?: Editor;

  public ngOnInit(): void {
    this.editor = new Editor({
      element: document.querySelector(".text-editor") || undefined,
      extensions: [StarterKit],
      content: "<p>Hello World!</p>"
    });
  }
}
