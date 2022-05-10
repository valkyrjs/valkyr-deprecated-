import { Component, OnDestroy, OnInit } from "@angular/core";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";

@Component({
  selector: "text-editor",
  templateUrl: "./Template.html"
})
export class TextEditorComponent implements OnInit, OnDestroy {
  private editor?: Editor;

  constructor(title: TitleService) {
    title.set("Editor", DOCUMENT_TITLE, "discovery");
  }

  public ngOnInit(): void {
    this.editor = new Editor({
      element: document.querySelector(".text-editor") || undefined,
      extensions: [StarterKit],
      content: "<p>Hello World!</p>"
    });
  }

  public ngOnDestroy(): void {
    this.editor?.destroy();
  }
}
