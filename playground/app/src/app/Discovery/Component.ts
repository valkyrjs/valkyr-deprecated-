import { Component } from "@angular/core";
import { Menu } from "@valkyr/angular";

@Component({
  selector: "discovery",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class DiscoveryComponent {
  aside!: Menu;

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

  #loadMenu() {
    this.aside = new Menu({
      categories: [
        {
          name: "Workspaces",
          items: [
            {
              name: "My workspaces",
              href: "/workspaces"
            },
            {
              name: "Shared workspaces",
              href: "/workspaces"
            },
            {
              name: "Invites",
              href: "/workspaces"
            }
          ]
        },
        {
          name: "Sandbox",
          items: [
            {
              name: "Text Editor",
              href: "/editor"
            },
            {
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
