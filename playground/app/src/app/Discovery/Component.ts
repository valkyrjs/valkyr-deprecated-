import { Component } from "@angular/core";
import { Menu } from "@valkyr/angular";

@Component({
  selector: "discovery",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class DiscoveryComponent {
  mainMenu!: Menu;
  footerMenu!: Menu;

  constructor() {
    this.#loadMenu();
  }

  people: Person[] = [
    { id: 1, name: "Durward Reynolds", unavailable: false },
    { id: 2, name: "Kenton Towne", unavailable: false },
    { id: 3, name: "Therese Wunsch", unavailable: false },
    { id: 4, name: "Benedict Kessler", unavailable: true },
    { id: 5, name: "Katelyn Rohan", unavailable: false }
  ];

  selectedPerson: Person | null = this.people[0];

  setSelectedPerson(person: Person | null) {
    this.selectedPerson = person;
  }

  hmm() {
    window.alert("need to think this through more");
  }

  #loadMenu() {
    this.mainMenu = new Menu({
      categories: [
        {
          name: "Main",
          showLabel: false,
          items: [
            {
              type: "link",
              icon: "home",
              name: "Home",
              isActive: true,
              href: "/workspaces"
            }
          ]
        },
        {
          name: "Workspaces",
          items: [
            {
              type: "link",
              icon: "workspace",
              name: "My workspaces",
              href: "/workspaces"
            },
            {
              type: "link",
              icon: "users",
              name: "Shared with you",
              href: "/workspaces"
            },
            {
              type: "link",
              name: "Invites",
              icon: "mail",
              href: "/workspaces"
            },
            {
              type: "link",
              name: "Archived",
              icon: "trash",
              href: "/workspaces"
            }
          ]
        }
      ]
    });
    this.footerMenu = new Menu({
      categories: [
        {
          name: "Sandbox",
          items: [
            {
              type: "link",
              icon: "text-edit",
              name: "Text Editor",
              href: "/editor"
            },
            {
              type: "link",
              icon: "design",
              name: "Design System",
              href: "/ui"
            }
          ]
        }
      ]
    });
  }
}

interface Person {
  id: number;
  name: string;
  unavailable: boolean;
}
