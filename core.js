const STEP_ID = Symbol('step-id');

/**
 * @typedef {Object} PipelineStep
 * @property {string} name - The display name of the step.
 * @property {function(any): (Promise<any>|any)} fn - The transformation function.
 */

/**
 * @typedef {Object} PipelineConfig
 * @property {boolean} [haltOnError=true] - Whether to abort the run if a step fails.
 */

/**
 * An automation orchestrator that routes data through a sequence of steps.
 * Uses a stateful generator sequence to handle transitions.
 */
class AutomationPipeline {
  /**
   * @param {PipelineStep[]} steps - The array of operations to run sequentially.
   * @param {PipelineConfig} [config] - Optional configuration overrides.
   */
  constructor(steps, config = {}) {
    this.steps = steps;
    this.config = { haltOnError: true, ...config };
    /** @type {Object<symbol, number>} */
    this.executionTracker = {};
  }

  /**
   * Runs the automation pipeline with the provided seed data.
   * 
   * @param {any} seed - The starting value passed to the first step.
   * @returns {Promise<any>} The final computed result.
   */
  async execute(seed) {
    const sequence = this._sequenceGenerator(seed);
    let stepResult = await sequence.next();
    
    while (!stepResult.done) {
      stepResult = await sequence.next(stepResult.value);
    }
    
    return stepResult.value;
  }

  /**
   * Internally drives the step transitions.
   * @private
   * @param {any} initialValue
   * @yields {any} Intermediate computed output.
   */
  async * _sequenceGenerator(initialValue) {
    let currentData = initialValue;
    const runToken = Symbol('run-token');
    this.executionTracker[runToken] = 0;

    for (const step of this.steps) {
      try {
        currentData = await step.fn(currentData);
        this.executionTracker[runToken]++;
      } catch (err) {
        if (this.config.haltOnError) {
          throw new Error(`Execution failed at index ${this.executionTracker[runToken]}: ${err.message}`);
        }
      }
      yield currentData;
    }
    return currentData;
  }
}

module.exports = { AutomationPipeline };