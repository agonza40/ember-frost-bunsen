import {expect} from 'chai'
import Ember from 'ember'
const {merge} = Ember
import {$hook} from 'ember-hook'

import {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError
} from './common'

const SELECTORS = {
  CHECKBOX: '.frost-checkbox input[type="checkbox"]',
  DISABLED_CHECKBOX: '.frost-checkbox input[type="checkbox"]:disabled',
  ENABLED_CHECKBOX: '.frost-checkbox input[type="checkbox"]:not(:disabled)',
  LABEL: '.frost-checkbox label'
}

/**
 * Click on boolean renderer checkbox
 * @param {String} bunsenId - bunsen ID for property rendered as boolean
 * @param {String} hook - form's hook
 */
export function click (bunsenId, hook) {
  hook = hook || 'bunsenForm'

  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()

  $renderer.find('input[type="checkbox"]').click()
}

/**
 * Check whether or not checkbox is checked/unchecked as expected
 * @param {jQuery} $renderer - jQuery instance of renderer DOM (wrapper tag)
 * @param {Boolean} checked - whether or not checkbox should be checked
 */
function expectCheckedInput ($renderer, checked) {
  const verb = checked ? 'checked' : 'unchecked'

  expect(
    $renderer.find(SELECTORS.CHECKBOX).prop('checked'),
    `checkbox is ${verb}`
  )
    .to.equal(checked)
}

/**
* Check whether or not checkbox is disabled/enabled as expected
* @param {jQuery} $renderer - jQuery instance of renderer DOM (wrapper tag)
* @param {Boolean} disabled - whether or not checkbox should be disabled
 */
function expectDisabledInput ($renderer, disabled) {
  const selector = disabled ? SELECTORS.DISABLED_CHECKBOX : SELECTORS.ENABLED_CHECKBOX
  const determinerPlusVerb = disabled ? 'a disabled' : 'an enabled'

  expect(
    $renderer.find(selector),
    `renders ${determinerPlusVerb} checkbox input`
  )
    .to.have.length(1)
}

function expectLabel ($renderer, label) {
  const labelText = $renderer.find(SELECTORS.LABEL)
    .text().trim() // Remove whitespace around label text (often newlines)

  expect(
    labelText,
    'renders expected label text'
  )
    .to.equal(label === null ? '' : label)
}

/**
 * Check that property is renderer as a boolean with expected state
 * @param {String} bunsenId - bunsen ID for property rendered as boolean
 * @param {Object} state - expected state of boolean renderer
 */
export function expectWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()

  const defaults = {
    checked: false,
    disabled: false
  }

  state = merge(defaults, state)

  expect(
    $renderer,
    'has expected class'
  )
    .to.have.class('frost-bunsen-input-boolean')

  expectCheckedInput($renderer, state.checked)
  expectDisabledInput($renderer, state.disabled)

  if (state.label !== undefined) {
    expectLabel($renderer, state.label)
  }

  if (state.error) {
    expectBunsenInputToHaveError(bunsenId, state.error, hook)
  } else {
    expectBunsenInputNotToHaveError(bunsenId, hook)
  }
}
