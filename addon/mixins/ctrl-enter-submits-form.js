/* global KeyEvent */
import Ember from 'ember';

/**
 * When the CTRL+ENTER is pressed the nearest form up the dom is triggered for submit.  By default this behaviour
 * is not activated.  See `ctrlEnterSubmitsForm?` for more information.
 */
export default Ember.Mixin.create({
  /**
   * Pass in a closure function to fire after the form submit is triggered.
   * The function will receive three parameters: the first is the DOM event, the second is
   * `this` component, and the third is the jQuery wrapped `$form`.
   */
  afterCtrlEnterSubmitAction: undefined,
  /**
   * Pass in a closure function to fire before the form submit is triggered.
   * The function will receive three parameters: the first is the DOM event, the second is
   * `this` component, and the third is the jQuery wrapped `$form`.
   */
  beforeCtrlEnterSubmitAction: undefined,
  /**
   * When set to `true`, CTRL+ENTER will attempt to submit the nearest form.  Set this to `false` if you do not
   * want this behaviour.  Default value is `false`.
   */
  'ctrlEnterSubmitsForm?': false,
  /**
   * The keyDown event is determining whether CTRL+ENTER was pressed.
   * If you override make sure to `this._super(...arguments)` to preserve this behaviour.
   * @param event
   */
  keyDown(event) {
    this._super(...arguments);
    if (this.get('ctrlEnterSubmitsForm?') &&
      (event.ctrlKey && (event.keyCode === KeyEvent.DOM_VK_ENTER || event.keyCode === KeyEvent.DOM_VK_RETURN))) {
      event.preventDefault();
      const $form = this.get('_form');
      if (Ember.isPresent($form)) {
        // fire the before-submit action
        if (Ember.isPresent(this.get('beforeCtrlEnterSubmitAction'))) {
          this.get('beforeCtrlEnterSubmitAction')(event, this, $form);
        }
        $form.trigger('submit');
        // fire the after-submit action
        if (Ember.isPresent(this.get('afterCtrlEnterSubmitAction'))) {
          this.get('afterCtrlEnterSubmitAction')(event, this, $form);
        }
      }
    }
  },
  /**
   * Grab the nearest form.  Normally you can just ask an input for it's `this.form`, however that doesn't
   * seem to work with Ember wrapped TextSupport components?  Using a jQuery find of the closest form instead.
   */
  _form: Ember.computed(function () {
    return this.$().closest('form');
  })
});
