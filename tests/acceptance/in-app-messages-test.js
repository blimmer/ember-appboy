import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | in app messages');

test('modals with URI ClickActions handle transition correctly', function(assert) {
  visit('/in-app-messages');
  click('#trigger-modal-with-transition');
  andThen(function() {
    let $el = findWithAssert('.ab-in-app-message', 'body');
    assert.equal($el.length, 1);
  });
  click('.ab-message-text', 'body');
  andThen(function() {
    assert.equal(currentURL(), '/in-app-messages/example-1');
  });
});
