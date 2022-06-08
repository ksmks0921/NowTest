/**
 * @flow
 *
 * Contains all UI related redux actions
 */

/**
 * Builds an action to hide the loading indicator
 */
export const hideLoading = () => ({
  type: 'ui/loading/hide',
});

/**
 * Builds an action to show the loading indicator
 */
export const showLoading = () => ({
  type: 'ui/loading/show',
});
