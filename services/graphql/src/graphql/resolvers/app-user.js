const { applicationService } = require('@base-cms/id-me-service-clients');
const { UserInputError } = require('apollo-server-express');
const connectionProjection = require('../utils/connection-projection');
const typeProjection = require('../utils/type-projection');

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
    activeAppContext: async (_, args, { user, app, req }) => {
      const applicationId = app.getId();
      const email = user.get('email');
      const { ip: ipAddress } = req;
      if (user.hasValidUser('AppUser') && applicationId !== user.getAppId()) {
        throw new UserInputError('The provided application context does not match the app for the user.');
      }
      return applicationService.request('loadContext', { applicationId, email, ipAddress });
    },

    checkContentAccess: async (_, { input }, { user, app, req }) => {
      const applicationId = app.getId();
      const email = user.get('email');
      const { ip: ipAddress } = req;
      const { isEnabled, requiredAccessLevelIds } = input;
      if (user.hasValidUser('AppUser') && applicationId !== user.getAppId()) {
        throw new UserInputError('The provided application context does not match the app for the user.');
      }
      return applicationService.request('checkAccess', {
        applicationId,
        email,
        ipAddress,
        isEnabled,
        requiredAccessLevelIds,
      });
    },

    appUsers: (_, { input }, { app }, info) => {
      const id = app.getId();
      const { sort, pagination } = input;
      const fields = connectionProjection(info);
      return applicationService.request('user.listForApp', {
        id,
        sort,
        pagination,
        fields,
      });
    },
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
    appUser: (_, { input }, { app }, info) => {
      const applicationId = app.getId();
      const { email } = input;
      const fields = typeProjection(info);
      return applicationService.request('user.findByEmail', {
        applicationId,
        email,
        fields,
      });
    },
    matchAppUsers: (_, { input }, { app }, info) => {
      const applicationId = app.getId();

      const fields = connectionProjection(info);
      const {
        field,
        phrase,
        position,
        pagination,
        sort,
        excludeIds,
      } = input;

      return applicationService.request('user.matchForApp', {
        applicationId,
        field,
        phrase,
        position,
        fields,
        pagination,
        sort,
        excludeIds,
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

    manageCreateAppUser: (_, { input }, { app }) => {
      const applicationId = app.getId();
      const {
        email,
        givenName,
        familyName,
        accessLevelIds,
        teamIds,
      } = input;
      const payload = {
        email,
        givenName,
        familyName,
        accessLevelIds,
        teamIds,
      };
      return applicationService.request('user.manageCreate', {
        applicationId,
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
      const {
        email,
        fields,
        authUrl,
        redirectTo,
      } = input;
      return applicationService.request('user.sendLoginLink', {
        applicationId,
        authUrl,
        redirectTo,
        email,
        fields,
      });
    },

    /**
     *
     */
    updateAppUser: (_, { input }, { app }) => {
      const applicationId = app.getId();
      const { id, payload } = input;
      return applicationService.request('user.updateOne', {
        id,
        applicationId,
        payload,
      });
    },
  },
};
