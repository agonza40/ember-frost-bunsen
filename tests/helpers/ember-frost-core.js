import {expect} from 'chai'
import Ember from 'ember'
const {typeOf} = Ember
import {$hook} from 'ember-hook'

const assign = Object.assign || Ember.assign || Ember.merge

/**
 * @typedef {Object} FrostButtonState
 * @property {Boolean} [disabled=false] - whether or not button is disabled
 * @property {String} [icon] - name of button icon
 * @property {String} [pack="frost"] - name of icon pack for button's icon
 * @property {String} [text] - button text
 */

/**
 * @typedef {Object} FrostTextState
 * @property {String} [align="left"] - text alignment
 * @property {Boolean} [disabled=false] - whether or not input is disabled
 * @property {Boolean} [error=false] - whether or not input is in error state
 * @property {String} [placeholder] - placeholder text
 * @property {Number} [tabIndex=0] - tab index
 * @property {String} [value] - value of input
 */

/**
 * Expect element to have disabled state
 * @param {jQuery} $element - element
 * @param {Boolean} disabled - disabled
 * @param {String} [type='element'] - type of element
 */
function expectDisabledState ($element, disabled, type = 'element') {
  expect(
    $element.is(':disabled'),
    `${type} is ${disabled ? 'disabled' : 'enabled'}`
  )
    .to.equal(disabled)
}

/**
 * Verify button exists with expected state
 * @param {jQuery|String} button - name of Ember hook or jQuery instance
 * @param {FrostButtonState} state - expected button state
 */
export function expectButtonWithState (button, state) {
  const defaults = {
    disabled: false,
    pack: 'frost'
  }

  const $button = typeOf(button) === 'string' ? $hook(button) : button
  state = assign(defaults, state)

  expectDisabledState($button, state.disabled, 'button')

  if (state.icon && state.pack) {
    expect(
      $button.find(`.frost-icon-${state.pack}-${state.icon}`),
      'button has expected icon'
    )
      .to.have.length(1)
  }

  if (state.text) {
    expect(
      $button.find('.text:not(.icon-text)').text().trim(),
      'button has expected text'
    )
      .to.equal(state.text)
  }
}

/**
 * Verify text input exists with expected state
 * @param {jQuery|String} input - name of Ember hook or jQuery instance
 * @param {FrostTextState} state - expected input state
 */
export function expectTextInputWithState (input, state) {
  const defaults = {
    align: 'left',
    disabled: false,
    error: false,
    tabIndex: 0
  }

  const $input = typeOf(input) === 'string' ? $hook(input) : input
  state = assign(defaults, state)

  expect(
    $input.hasClass(state.align),
    'input has correct text alignment'
  )
    .to.equal(true)

  expectDisabledState($input, state.disabled, 'input')

  expect(
    $input.hasClass('error'),
    `input ${state.error ? 'has' : 'does not have'} error class`
  )
    .to.equal(state.error)

  if (state.placeholder) {
    expect(
      $input.prop('placeholder'),
      'input has expected placeholder text'
    )
      .to.equal(state.placeholder)
  }

  expect(
    $input.prop('tabIndex'),
    'input has expected tab index'
  )
    .to.equal(state.tabIndex)

  if (state.value) {
    expect(
      $input.val(),
      'input has expected value'
    )
      .to.equal(state.value)
  }
}

export default {
  expectButtonWithState,
  expectTextInputWithState
}
