import Ember from 'ember';
import appboy from 'appboy';

const { ab: { InAppMessage: { ClickAction } } } = appboy;
const { Logger: { assert } } = Ember;

export function rewireUriClickEvent(item, uri, router) {
  item.subscribeToClickedEvent(() => {
    router.transitionTo(uri);
  });
  item.clickAction = ClickAction.NULL;
  item.uri = undefined;

  return item;
}

export function initialize(appInstance) {
  // TODO: Ember 1.13
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
      const router = appInstance.get('router');

      // If URI is set, use router for soft transition with router.js vs. hard
      // redirect / refresh
      [inAppMessage, ...inAppMessage.buttons].forEach(function(item) {
        if (item.clickAction === ClickAction.URI && item.uri) {
          rewireUriClickEvent(item, item.uri, router);
        }
      });

      _superShowInAppMessage(inAppMessage);
    };
  }

  appboy.openSession();
}

export default {
  name: 'appboy',
  initialize
};
