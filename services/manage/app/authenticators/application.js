import Base from 'ember-simple-auth/authenticators/base';
import { inject } from '@ember/service';
import { get } from '@ember/object';

export default Base.extend({
  auth: inject(),

  getToken(data) {
    return get(data, 'session.token');
  },

  restore(data) {
    const token = this.getToken(data);
    return this.get('auth').check(token);
  },

  authenticate(loginToken) {
    return this.get('auth').submit(loginToken);
  },

  invalidate(data) {
    const token = this.getToken(data);
    return this.get('auth').delete(token);
  },
});
