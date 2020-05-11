const {
  updateField,
  listForApp,
  matchForApp,
  findById,
  updateFieldWithApp,
} = require('@identity-x/utils').actions;
const { createRequiredParamError } = require('@base-cms/micro').service;
const create = require('./create');
const findByEmail = require('./find-by-email');
const login = require('./login');
const logout = require('./logout');
const manageCreate = require('./manage-create');
const sendLoginLink = require('./send-login-link');
const updateOne = require('./update-one');
const verifyAuth = require('./verify-auth');

const AppUser = require('../../mongodb/models/app-user');

module.exports = {
  create,
  findByEmail,
  findById: params => findById(AppUser, params),
  listForApp: params => listForApp(AppUser, params),
  login,
  logout,
  manageCreate,
  matchForApp: params => matchForApp(AppUser, params),
  sendLoginLink,
  updateField: params => updateField(AppUser, params),
  updateFieldWithApp: params => updateFieldWithApp(AppUser, params),
  updateOne,
  verifyAuth,
  setLastSeen: async ({ id }) => {
    if (!id) throw createRequiredParamError('id');
    const doc = await AppUser.findById(id);
    if (!doc) {
      const err = new Error(`No user found for ID ${id}.`);
      err.statusCode = 404;
      throw err;
    }
    doc.set('lastSeen', new Date());
    return doc.save();
  },
  setRegionalConsent: async ({ id, region, given }) => {
    if (!id) throw createRequiredParamError('id');
    if (!region) throw createRequiredParamError('region');
    const user = await AppUser.findById(id);
    if (!user) {
      const err = new Error(`No user found for ID ${id}.`);
      err.statusCode = 404;
      throw err;
    }
    const consentDoc = user.regionalConsent.id(region);
    if (consentDoc && !given) {
      // remove the existing consent
      consentDoc.remove();
    } else if (!consentDoc && given) {
      // add the consent
      user.regionalConsent.push({ _id: region, date: new Date() });
    }
    return user.save();
  },
};
