const { applicationService } = require('@base-cms/id-me-service-clients');

const { isArray } = Array;

module.exports = {
  AppUser: {
    id: user => user._id,
    accessLevels: ({ accessLevelIds }) => {
      if (!isArray(accessLevelIds) || !accessLevelIds.length) return [];
      const query = { _id: { $in: accessLevelIds } };
      return applicationService.request('access-level.find', { query });
    },
    teams: ({ teamIds }) => {
      if (!isArray(teamIds) || !teamIds.length) return [];
      const query = { _id: { $in: teamIds } };
      return applicationService.request('team.find', { query });
    },
  },

  Query: {
    /**
     *
     */
    activeAppUser: (_, args, { user }) => {
      const email = user.get('email');
      const applicationId = user.getAppId();
      return applicationService.request('user.findByEmail', {
        applicationId,
        email,
      });
    },

    /**
     * @todo This should be secured, otherwise anyone could guess by email
     */
    appUser: (_, { input }, { app }) => {
      const applicationId = app.getId();
      const { email } = input;
      return applicationService.request('user.findByEmail', {
        applicationId,
        email,
      });
    },
  },

  Mutation: {
    /**
     *
     */
    createAppUser: (_, { input }, { app }) => {
      const applicationId = app.getId();
      const { email, givenName, familyName } = input;
      const payload = { givenName, familyName };
      return applicationService.request('user.create', {
        applicationId,
        email,
        payload,
      });
    },

    /**
     *
     */
    loginAppUser: (_, { input }, { req, app }) => {
      const applicationId = app.getId();
      const { token } = input;
      const ua = req.get('user-agent');
      return applicationService.request('user.login', {
        applicationId,
        token,
        ip: req.ip,
        ua,
      });
    },

    /**
     *
     */
    logoutAppUser: (_, { input }, { app }) => {
      const applicationId = app.getId();
      const { token } = input;
      return applicationService.request('user.logout', {
        applicationId,
        token,
      });
    },

    /**
     *
     */
    sendAppUserLoginLink: (_, { input }, { app }) => {
      const applicationId = app.getId();
      const { email, fields, authUrl } = input;
      return applicationService.request('user.sendLoginLink', {
        applicationId,
        authUrl,
        email,
        fields,
      });
    },
  },
};