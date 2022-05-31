import { Component, OnDestroy, OnInit } from "@angular/core";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

import { LayoutService } from "../../Shared/Layout/Services/LayoutService";

@Component({
  selector: "text-editor",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TextEditorComponent implements OnInit, OnDestroy {
  private editor?: Editor;

  constructor(layout: LayoutService) {
    layout.updateLayout({
      header: {
        isVisible: true,
        menu: [
          {
            type: "link",
            icon: "home",
            name: "Home",
            isActive: false,
            href: "/workspaces"
          }
        ]
      },
      sidebar: { isVisible: false },
      sidepane: {
        isVisible: true,
        mainMenu: [
          {
            name: "Main",
            items: [
              {
                type: "link",
                icon: "home",
                name: "Home",
                isActive: false,
                href: "/workspaces"
              },
              {
                type: "link",
                icon: "text-edit",
                name: "Text Editor",
                isActive: true,

                href: "/editor"
              }
            ]
          }
        ]
      },
      nav: { isVisible: true, title: "Text Editor" }
    });
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
