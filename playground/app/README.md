# App

# Angular Cheat Sheet

## Elements

A quick list of angular elements and their use cases in comparison with react.

### ng-container

@see [ng-container](https://www.digitalocean.com/community/tutorials/angular-ng-container-element)

In react this would be `React.Fragment`, its an element that serves as a invisible wrapper and does not render into the dom.

### ng-content

@see [ng-content](https://www.geeksforgeeks.org/ng-content-in-angular/)

In react this would be `React.Children`, its an element that designates the spot where all child elements will render out.

```html
<div>
  <h1>My Component</h1>
  <ng-content></ng-content>
</div>
```

```html
<my-component>
  <p>I will render in ng-content</p>
</my-component>
```

## Styles

A quick reference to style isolation in angular.

### Encapsulation

@see [encapsulation](https://michalmuszynski.com/blog/styling-child-component-from-parent-in-angular/)

By default the only style classes available in the component is the ones defined in the components `style` or `styleUrls` configuration. If you want to expose the component to external classes you have to change the encapsulation state of the parent component.

```ts
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-parent",
  templateUrl: "./parent.component.html",
  styleUrls: ["./parent.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ParentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
```
