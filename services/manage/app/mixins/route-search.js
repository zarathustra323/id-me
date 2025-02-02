import Mixin from '@ember/object/mixin';
import RouteObservableMixin from '@base-cms/id-me-manage/mixins/route-observable';
import { inject } from '@ember/service';

export default Mixin.create(RouteObservableMixin, {
  errorNotifier: inject(),

  buildSearchVariables(input, {
    limit,
    phrase,
    sortField,
    sortOrder: order,
    field,
    position,
  } = {}) {
    const pagination = { limit };
    const sort = { field: sortField, order };
    return {
      input: {
        ...input,
        pagination,
        phrase,
        sort,
        field,
        position,
      },
    };
  },

  /**
   *
   * @param {*} queryOptions
   * @param {*} params
   */
  async search(apollo, { query, resultKey, params, input }) {
    const variables = this.buildSearchVariables(input, params);
    this.getController().set('resultKey', resultKey);
    try {
      const response = await apollo({ query, variables, fetchPolicy: 'network-only' }, resultKey);
      this.getController().set('observable', this.getObservable(response));
      return response;
    } catch (e) {
      this.errorNotifier.show(e);
    }
  },
});
