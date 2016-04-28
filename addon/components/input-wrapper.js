import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

export default Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-input-wrapper'],

  // Attributes
  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.null,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string
    ])
  },

  getDefaultProps () {
    return {
      readOnly: false,
      required: false
    }
  },

  @readOnly
  @computed('cellConfig.dependsOn', 'isDependencyMet')
  /**
   * Whether or not component should render if it is a dependency
   * @param {String} dependsOn - what input depends
   * @param {Boolean} isDependencyMet - whether or not dependency is met
   * @returns {Boolean} whether or not component should render if it is a dependency
   */
  shouldRender (dependsOn, isDependencyMet) {
    return !dependsOn || isDependencyMet
  },

  @readOnly
  @computed('cellConfig.renderer', 'model.{editable,type}', 'readOnly', 'shouldRender', 'store.renderers')
  /**
   * Get name of component helper
   * @param {String} renderer - custom renderer to use
   * @param {Boolean} editable - whether or not input should be editable (defined in model)
   * @param {String} type - type of input to render
   * @param {Boolean} readOnly - whether or not input should be rendered as read only
   * @param {Boolean} shouldRender - whether or not input should render if it is a dependency
   * @param {Object} renderers - key value pairs mapping custom renderers to component helper names
   * @returns {String} name of component helper to use for input
   */
  inputName (renderer, editable, type, readOnly, shouldRender, renderers) {
    if (renderer) {
      return renderers[renderer]
    }

    if (readOnly || editable === false) {
      return 'frost-bunsen-input-static'
    }

    if (renderers[type]) {
      return renderers[type]
    }

    if (shouldRender) {
      const rendererNamesInQuotes = Object.keys(renderers).map((key) => `"${key}"`)
      throw new Error(`Only ${rendererNamesInQuotes.join(',')} fields are currently supported.`)
    }
  }
})
