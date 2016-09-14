import Ember from 'ember';
import appboy from 'appboy';

const { Logger: { assert } } = Ember;

export function initialize(appInstance) {
  // TODO: 1.13.x support
  const config = appInstance.resolveRegistration('config:environment');
  assert(
    config.appboy.apiKey !== undefined,
    'You must set appboy.apiKey in your environment.js file for ember-appboy to work correctly.'
  );

  // This is the "recommended" quickstart for appboy
  // https://github.com/Appboy/appboy-web-sdk#getting-started
  appboy.initialize(config.appboy.apiKey);

  if (!config.appboy.coreOnly) {
    appboy.display.automaticallyShowNewInAppMessages();
  }

  appboy.openSession();
}

export default {
  name: 'appboy',
  initialize
};
