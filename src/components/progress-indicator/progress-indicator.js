import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';

class ProgressIndicator extends mixin(createComponent, initComponentBySearch) {
  /**
   * ProgressIndicator.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @param {HTMLElement} element The element representing the ProgressIndicator.
   * @param {Object} [state] The component state.
   * @param {Object} [state.currentIndex] The current step index.
   * @param {Object} [state.totalSteps] Total number of steps.
   * @param {Object} [options] The component options.
   * @property {string} [options.selectorStepElement] The CSS selector to find step elements.
   * @property {string} [options.selectorCurrent] The CSS selector to find the current step element.
   * @property {string} [options.selectorIncomplete] The CSS class to find incomplete step elements.
   * @property {string} [options.selectorComplete] The CSS selector to find completed step elements.
   * @property {string} [options.classStep] The className for a step element.
   * @property {string} [options.classComplete] The className for a completed step element.
   * @property {string} [options.classCurrent] The className for the current step element.
   * @property {string} [options.classIncomplete] The className for a incomplete step element.
   */
  constructor(element, options) {
    super(element, options);
    this.state = {
      currentIndex: this.getCurrent().index,
      totalSteps: this.getSteps().length,
    };
  }

  /**
   * Returns all steps with details about element and index.
   */
  getSteps() {
    return [...this.element.querySelectorAll(this.options.selectorStepElement)].map((element, index) => ({
      element,
      index,
    }));
  }

  /**
   * Returns current step; gives detail about element and index.
   */
  getCurrent() {
    const currentEl = this.element.querySelector(this.options.selectorCurrent);
    return this.getSteps().filter(step => step.element === currentEl)[0];
  }

  /**
   * Sets the current step.
   * * @param {Number} new step index or use default in `this.state.currentIndex`.
   */
  setCurrent(newCurrentStep = this.state.currentIndex) {
    let changed = false;

    if (newCurrentStep !== this.state.currentIndex) {
      this.state.currentIndex = newCurrentStep;
      changed = true;
    }

    if (changed) {
      this.getSteps().forEach(step => {
        if (step.index < newCurrentStep) {
          this._updateStep({
            element: step.element,
            className: this.options.classComplete,
            html: this._getSVGComplete(),
          });
        }

        if (step.index === newCurrentStep) {
          this._updateStep({
            element: step.element,
            className: this.options.classCurrent,
            html: this._getCurrentSVG(),
          });
        }

        if (step.index > newCurrentStep) {
          this._updateStep({
            element: step.element,
            className: this.options.classIncomplete,
            html: this._getIncompleteSVG(),
          });
        }
      });
    }
  }

  /**
   * Update step with correct inline SVG and className
   * @param {Object} args
   * @param {Object} [args.element] target element
   * @param {Object} [args.className] new className
   * @param {Object} [args.html] new inline SVG to insert
   */
  _updateStep(args) {
    const { element, className, html } = args;

    if (element.firstElementChild) {
      element.removeChild(element.firstElementChild);
    }

    if (!element.classList.contains(className)) {
      element.setAttribute('class', this.options.classStep);
      element.classList.add(className);
    }

    element.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Returns HTML string for an SVG used to represent a compelted step (checkmark)
   */
  _getSVGComplete() {
    return `<svg width="24px" height="24px" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12"></circle>
        <polygon points="10.3 13.6 7.7 11 6.3 12.4 10.3 16.4 17.8 9 16.4 7.6"></polygon>
      </svg>`;
  }

  /**
   * Returns HTML string for an SVG used to represent current step (circles, like a radio button, but not.)
   */
  _getCurrentSVG() {
    return `<svg>
        <circle cx="12" cy="12" r="12"></circle>
        <circle cx="12" cy="12" r="6"></circle>
      </svg>`;
  }

  /**
   * Returns HTML string for an SVG used to represent incomple step (grey empty circle)
   */
  _getIncompleteSVG() {
    return `<svg>
        <circle cx="12" cy="12" r="12"></circle>
      </svg>`;
  }

  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode ProgressIndicator.create .create()}, or {@linkcode ProgressIndicator.init .init()},
   * properties in this object are overriden for the instance being created.
   * @member ProgressIndicator.options
   * @type {Object}
   * @property {string} selectorInit The CSS selector to find content switcher button set.
   * @property {string} [selectorStepElement] The CSS selector to find step elements.
   * @property {string} [selectorCurrent] The CSS selector to find the current step element.
   * @property {string} [selectorIncomplete] The CSS class to find incomplete step elements.
   * @property {string} [selectorComplete] The CSS selector to find completed step elements.
   * @property {string} [classStep] The className for a step element.
   * @property {string} [classComplete] The className for a completed step element.
   * @property {string} [classCurrent] The className for the current step element.
   * @property {string} [classIncomplete] The className for a incomplete step element.
   */
  static options = {
    selectorInit: '[data-progress]',
    selectorStepElement: '.bx--progress-step',
    selectorCurrent: '.bx--progress-step--current',
    selectorIncomplete: '.bx--progress-step--incomplete',
    selectorComplete: '.bx--progress-step--complete',
    classStep: 'bx--progress-step',
    classComplete: 'bx--progress-step--complete',
    classCurrent: 'bx--progress-step--current',
    classIncomplete: 'bx--progress-step--incomplete',
  };
}

export default ProgressIndicator;
