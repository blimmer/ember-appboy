import Ember from 'ember';
import AppboyInitializer from 'dummy/initializers/appboy';
import { module } from 'qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import appboy from 'appboy';
import sinon from 'sinon';

let application,
    configStub,
    sandbox,
    appboyInitialize,
    appboyOpenSession,
    appboyAutomaticallyShowNewInAppMessages;

module('Unit | Initializer | appboy', {
  before() {
    sandbox = sinon.sandbox.create();
  },

  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
      // default
      configStub = sandbox.stub(application, 'resolveRegistration')
                          .withArgs('config:environment')
                          .returns({ appboy: { apiKey: 'abc123' } });
      appboyInitialize = sandbox.stub(appboy, 'initialize');
      appboyOpenSession = sandbox.stub(appboy, 'openSession');
      appboyAutomaticallyShowNewInAppMessages = sandbox.stub();
      appboy.display = { automaticallyShowNewInAppMessages: appboyAutomaticallyShowNewInAppMessages };
    });
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it calls initialize with the api key', function(assert) {
  AppboyInitializer.initialize(application);

  assert.ok(appboyInitialize.withArgs('abc123').calledOnce);
});

test('it sets up in-app message display automatically', function(assert) {
  AppboyInitializer.initialize(application);

  assert.ok(appboyAutomaticallyShowNewInAppMessages.calledOnce);
});

test('it does not set up in-app message display when only using core', function(assert) {
  configStub.returns({ appboy: { apiKey: 'abc123', coreOnly: true } });
  AppboyInitializer.initialize(application);

  assert.notOk(appboyAutomaticallyShowNewInAppMessages.called);
});

test('it opens the session', function(assert) {
  AppboyInitializer.initialize(application);

  assert.ok(appboyOpenSession.calledOnce);
});
