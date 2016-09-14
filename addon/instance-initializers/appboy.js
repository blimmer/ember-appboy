import Ember from 'ember';
import appboy from 'appboy';

const { ab: { InAppMessage: { ClickAction } } } = appboy;
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

    const _superShowInAppMessage = appboy.display.showInAppMessage;

    appboy.display.showInAppMessage = function(inAppMessage) {
      if (inAppMessage.clickAction === ClickAction.URI && inAppMessage.uri) {
        // If URI is set, use router for soft transition with router.js vs. hard
        // redirect / refresh
        const router = appInstance.get('router');
        const targetRoute = inAppMessage.uri;
        inAppMessage.subscribeToClickedEvent(() => {
          router.transitionTo(targetRoute);
        });
        inAppMessage.clickAction = ClickAction.NULL;
        inAppMessage.uri = undefined;
      }

      _superShowInAppMessage(inAppMessage);
    };
  }

  appboy.openSession();
}

export default {
  name: 'appboy',
  initialize
};
