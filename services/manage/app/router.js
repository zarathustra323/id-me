import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('signup');
  this.route('features');
  this.route('pricing');
  this.route('manage');
  this.route('authenticate', { path: '/authenticate/:token' });
});

export default Router;
