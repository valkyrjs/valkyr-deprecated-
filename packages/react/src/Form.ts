import Joi from "joi";

export abstract class Form<Inputs extends Record<string, any> = {}> {
  /**
   * JOI schematic form the form inputs.
   */
  abstract readonly schema: ReturnType<typeof Joi.object>;

  /**
   * Errors reported by JOI during validation.
   */
  errors?: Partial<Inputs>;

  /**
   * Element references for easy access and manipulation of registered
   * form input elements.
   */
  #elements: Record<string, HTMLInputElement | HTMLSelectElement> = {};

  /*
   |--------------------------------------------------------------------------------
   | Constructor
   |--------------------------------------------------------------------------------
   */

  constructor(
    readonly inputs: Inputs,
    readonly setFormState: FormStateHandler<Form>,
    readonly submitResponse?: (response: any) => void
  ) {
    this.#bindMethods();
    this.setState();
  }

  #bindMethods() {
    this.register = this.register.bind(this);
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submit = this.submit.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get hasError() {
    return this.errors !== undefined;
  }

  /*
   |--------------------------------------------------------------------------------
   | Registrars
   |--------------------------------------------------------------------------------
   */

  /**
   * Register a input element with the form. This registers form related methods and a
   * reference to the element itself that can be utilized by the form.
   *
   * @param name - Name of the input field.
   */
  register<Key extends keyof Inputs>(name: Key) {
    return {
      name,
      ref: (element: HTMLInputElement | HTMLSelectElement) => {
        this.#elements[name as string] = element;
      },
      defaultValue: this.get(name),
      onChange: ({ target: { value } }: any) => {
        this.set(name, value);
        this.setState();
      }
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Data
   |--------------------------------------------------------------------------------
   */

  /**
   * Set the value of an input field.
   *
   * @param name  - Name of the input field.
   * @param value - Value to set.
   */
  set<Key extends keyof Inputs>(name: Key, value: Inputs[Key]): void {
    this.inputs[name] = value;
    this.setState();
  }

  /**
   * Get the current input values or a specific input value.
   *
   * @param name - Name of the input field. _(Optional)_
   */
  get(): Inputs;
  get<Key extends keyof Inputs>(name: Key): Inputs[Key];
  get<Key extends keyof Inputs>(name?: Key): Inputs | Inputs[Key] {
    if (name === undefined) {
      return this.inputs;
    }
    return this.inputs[name];
  }

  clear() {
    for (const key in this.#elements) {
      this.#elements[key].value = "";
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | State
   |--------------------------------------------------------------------------------
   */

  setState() {
    this.setFormState(this.getState());
  }

  getState<F extends Form>(): FormState<F>["form"] {
    return {
      inputs: this.inputs,
      errors: this.errors,
      register: this.register,
      submit: this.handleSubmit
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Submission
   |--------------------------------------------------------------------------------
   */

  async handleSubmit(event: any) {
    event.preventDefault?.();
    const errors = this.validate();
    if (errors !== false) {
      this.errors = errors;
      this.setState();
    } else {
      this.errors = undefined;
      const response = await this.submit();
      this.setState();
      this.submitResponse?.(response);
    }
  }

  /**
   * Validate the form inputs against the validator class.
   */
  validate(): Partial<Inputs> | false {
    const result = this.schema.validate(this.inputs);
    if (result.error !== undefined) {
      return result.error.details.reduce<Partial<Inputs>>(
        (error, next) => ({
          ...error,
          [next.path[0]]: next.message
        }),
        {}
      );
    }
    return false;
  }

  /**
   * Form submission handler defined by the parent class.
   */
  protected abstract submit(): Promise<any>;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type FormStateHandler<F extends Form> = (state: FormState<F>["form"]) => void;

export type FormState<F extends Form> = {
  form: {
    inputs: F["inputs"];
    errors?: Partial<F["inputs"]>;
    register: F["register"];
    submit: F["handleSubmit"];
  };
};
