---
title: Controller
sections: ["React"]
---

## Introduction

With our experimental `ViewController` we create a view controller that uses React to render its state and actions.

In our example we use the following example project structure:

```
modules/
└─ home/
   ├─ views/
   |  ├─ home.controller.ts
   │  └─ home.view.tsx
   └─ home.module.ts
```

A controller is meant to facilitate a part of the applications logic. It is responsible for handling application state, user input and updating the view its been assigned accordingly.

---

### State

The state of a controller is represented by a plain object. It is meant to be serializable and immutable. The state is passed to the view to render the current state of the application. All modification of state should occur through the controllers exposed actions.

The state is defined and initialized by the constructor of the base controller and is further manipulated through the `setState` method.

```ts
class FooController extends Controller<State> {
  async onInit() {
    return {
      foo: "bar"
    };
  }

  setFoo(value: State["foo"]) {
    this.setState("foo", value);
  }
}

type State = {
  foo: string;
};
```

The preceding code defines a example controller with a `state` that has a single property `foo` of type `string`. On the controller we provide a static `state` property which is used to initialize the default `state` of the controller. This ensures that the `state` is always available in the correct format for the view.

The example controller also provides a `action` method `setFoo` which is used to update the state of the controller. The `setState` method takes the name of the property to update and the new value. The new state is then passed to the view to render the updated state.

---

### On Init

The controller can be provided with a `onInit` event handler method which is responsible for returning initial state and initiate subscriptions on first instantiation of a view instance. The `onInit` is called only once during a views lifecycle, if you have state that depends on `props` use the `onResolve` lifecycle method which executes every time the view properties changes.

```ts
class FooController extends Controller<State> {
  async onInit() {
    return {
      foos: await fetch("/foos")
    };
  }
}

type State = {
  foos: string[];
};
```

---

### On Resolve

The controller can be provided with a `onResolve` event handler method which is responsible for returning state and initiate subscriptions based on changes to the components props. The `onResolve` is called anytime the component is influenced by external changes so we are expected to re-initialize all subscriptions and return the new state when the method is triggered.

```ts
class FooController extends Controller<State, Props> {
  async onResolve() {
    return {
      foo: await fetch(`/foo?bar=${this.props.bar}`)
    };
  }
}

type Props = {
  bar: string;
};

type State = {
  foo: string;
};
```

The preceding code defines a example controller that performs a asynchronous request to fetch the value of `foo` based on the value of `bar`. The `onResolve` method is called when the view is mounted and subsequently when the `bar` property is updated.

:::div{class="admonitions"}

By default it is expected that resolve is only executed once during view mounting, and only when the view properties has changed. We advice against using the resolve method by the controller itself so its generally a good idea to split the methods that you want to re-use within the controller.

:::

---

### Queries

The controller comes with a query handler using models from the `@valkyr/db` package. The query handler is used to fetch data from the local database and update the state of the controller.

```ts
class FooController extends Controller<State> {
  async onInit() {
    return {
      foo: await this.query(Foo, { limit: 1 }, "foo")
    };
  }
}

type State = {
  foo?: Foo;
};
```

### Subscriptions

The controller comes with a subscription handler using `Subscription` from the `rxjs` Observer library. When assigning a subscription it will be automatically unsubscribed from when the view is unmounted. We also provide a quality of life `setNext` method which you can apply directly to the the subscriptions `next` handler.

```ts
const foo = new Subject<string>();

class FooController extends Controller<State> {
  async onInit() {
    this.subscribe(foo, this.setNext("foo"));
    return {
      foo: this.state.foo ?? ""
    };
  }
}

type State = {
  foo: string;
};
```

The preceding code defines a example controller that subscribes to rxjs subject and updates the `foo` state when the subject is given a new value.

---

### Export

To make use of your controller you have to wrap it in a `ViewController` factory class and export it.

```ts
export const controller = new ViewController(FooController);
```

---

## View

The view is responsible for rendering the current state of the application. It is also responsible for handling user input and dispatching actions to the controller.

```tsx
export const HomeView = controller.view(({ state, actions }) => (
  <div>
    <h1>{state.foo}</h1>
    <input type="text" value={state.foo} onChange={(e) => actions.setFoo(e.target.value)} />
  </div>
));
```
