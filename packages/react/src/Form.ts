import JoiRoot from "joi";

export const Joi = JoiRoot;

export abstract class Form<Inputs extends Record<string, any> = {}> {
  abstract readonly schema: ReturnType<typeof Joi.object>;

  #debounce: FormDebounce<Inputs> = {
    validate: {}
  };

  #defaults: Partial<Inputs> = {};
  #errors: FormErrors<Inputs> = {};
  #elements: Record<string, HTMLInputElement | HTMLSelectElement> = {};

  #onChange: OnChangeCallback<Inputs>;
  #onError: OnErrorCallback<Inputs>;
  #onSubmit: OnSubmitCallback<Inputs>;
  #onResponse: OnResponseCallback;

  /*
   |--------------------------------------------------------------------------------
   | Constructor
   |--------------------------------------------------------------------------------
   */

  constructor(readonly inputs: Inputs) {
    this.#bindMethods();
    this.#setDefaults();
    this.#setSubmit();
  }

  #bindMethods() {
    this.register = this.register.bind(this);
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
  }

  #setDefaults() {
    for (const key in this.inputs) {
      this.#defaults[key] = this.inputs[key];
    }
  }

  #setSubmit() {
    if ((this.constructor as any).submit !== undefined) {
      this.onSubmit((this.constructor as any).submit);
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get hasError() {
    return Object.keys(this.errors).length !== 0;
  }

  get errors(): FormErrors<Inputs> {
    return this.#errors;
  }

  set errors(value: FormErrors<Inputs>) {
    this.#errors = value;
    this.#onError?.(value);
  }

  /*
   |--------------------------------------------------------------------------------
   | Registrars
   |--------------------------------------------------------------------------------
   */

  onChange(callback: OnChangeCallback<Inputs>): this {
    this.#onChange = callback;
    return this;
  }

  onError(callback: OnErrorCallback<Inputs>): this {
    this.#onError = callback;
    return this;
  }

  onSubmit(callback: OnSubmitCallback<Inputs>): this {
    this.#onSubmit = callback;
    return this;
  }

  onResponse(callback: OnResponseCallback): this {
    this.#onResponse = callback;
    return this;
  }

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
    this.#onChange?.(name, value);
    clearTimeout(this.#debounce.validate[name]);
    this.#debounce.validate[name] = setTimeout(() => {
      this.validate(name);
    }, 200);
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
    for (const key in this.inputs) {
      const value = this.#defaults[key];
      this.inputs[key] = value;
      if (this.#elements[key] !== undefined) {
        this.#elements[key].value = value;
      }
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Submission
   |--------------------------------------------------------------------------------
   */

  async submit(event: any) {
    event.preventDefault?.();
    this.validate();
    if (this.hasError === false) {
      const response = await this.#onSubmit?.(this);
      this.#onResponse?.(response);
    }
  }

  validate(name?: keyof Inputs) {
    if (name !== undefined) {
      this.#validateInput(name);
    } else {
      this.#validateForm();
    }
  }

  #validateForm(): void {
    this.errors = this.#getFormErrors();
  }

  #validateInput(name: keyof Inputs): void {
    const errors = this.#getFormErrors();
    let hasChanges = false;
    if (errors[name] === undefined && this.errors[name] !== undefined) {
      delete this.errors[name];
      hasChanges = true;
    }
    if (errors[name] !== undefined && this.errors[name] !== errors[name]) {
      this.errors[name] = errors[name];
      hasChanges = true;
    }
    if (hasChanges === true) {
      this.#onError?.({ ...this.errors });
    }
  }

  #getFormErrors(): FormErrors<Inputs> {
    const result = this.schema.validate(this.inputs, { abortEarly: false, allowUnknown: true });
    if (result.error !== undefined) {
      return result.error.details.reduce<Partial<Inputs>>(
        (error, next) => ({
          ...error,
          [next.path[0]]: next.message
        }),
        {}
      );
    }
    return {};
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type OnChangeCallback<Inputs extends {}, Key extends keyof Inputs = keyof Inputs> = (
  name: Key,
  value: Inputs[Key]
) => void;

type OnErrorCallback<Inputs extends {}> = (errors: FormErrors<Inputs>) => void;

type OnSubmitCallback<Inputs extends {}> = (form: Form<Inputs>) => Promise<any>;

type OnResponseCallback = (response: any) => void;

type FormDebounce<Inputs extends {}> = {
  validate: {
    [Key in keyof Inputs]?: any;
  };
};

type FormErrors<Inputs extends {}> = {
  [Key in keyof Inputs]?: string;
};