import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "dropdown",
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          opacity: 1,
          display: "block"
        })
      ),
      state(
        "closed",
        style({
          opacity: 0,
          display: "none"
        })
      ),
      transition("open => closed", [animate("0.12s")]),
      transition("closed => open", [animate("0.12s")])
    ])
  ],
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class SelectComponent implements OnInit {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  @Input() append = false;
  @Input() value: string | undefined = undefined;

  @Input() options: SelectOptions = [];

  constructor() {}

  ngOnInit(): void {}

  selectValue(value: string): void {
    this.isOpen = false;
    this.value = value;
  }

  isSelected(value: string): boolean {
    return value === this.value;
  }

  public selectedOption(): SelectOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }
}

export type SelectOptions = SelectOption[];

export type SelectOption = {
  icon?: string;
  label: string;
  value: string;
};
