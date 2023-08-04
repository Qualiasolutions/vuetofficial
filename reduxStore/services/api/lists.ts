import {
  AllPlanningListItems,
  AllPlanningLists,
  AllPlanningSublists,
  FormUpdateListEntryRequest,
  ListEntryResponse,
  PlanningList,
  PlanningListItem,
  PlanningSublist
} from 'types/lists';
import { vuetApi } from './api';
import entitiesApi from './entities';

const normalisePlanningLists = (data: PlanningList[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byCategory: data.reduce<{ [key: number]: number[] }>(
      (prev, next) => ({
        ...prev,
        [next.category]: prev[next.category]
          ? [...prev[next.category], next.id]
          : [next.id]
      }),
      {}
    )
  };
};

const normalisePlanningSublists = (data: PlanningSublist[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byList: data.reduce<{ [key: number]: number[] }>(
      (prev, next) => ({
        ...prev,
        [next.list]: prev[next.list] ? [...prev[next.list], next.id] : [next.id]
      }),
      {}
    )
  };
};

const normalisePlanningListItems = (data: PlanningListItem[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    bySublist: data.reduce<{ [key: number]: number[] }>(
      (prev, next) => ({
        ...prev,
        [next.sublist]: prev[next.sublist]
          ? [...prev[next.sublist], next.id]
          : [next.id]
      }),
      {}
    )
  };
};

const listsApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    updateListEntry: builder.mutation<
      ListEntryResponse,
      Partial<ListEntryResponse> & Pick<ListEntryResponse, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/list-entry/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Entity']
    }),
    formUpdateListEntry: builder.mutation<
      ListEntryResponse,
      FormUpdateListEntryRequest
    >({
      query: (payload) => ({
        url: `core/list-entry/${payload.id}/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: payload.formData
      }),
      invalidatesTags: ['Entity']
    }),
    createListEntry: builder.mutation<
      ListEntryResponse,
      Partial<Omit<ListEntryResponse, 'id'>>
    >({
      query: (body) => {
        return {
          url: 'core/list-entry/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Entity'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of entitiesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Entity' }
        ])) {
          if (endpointName !== 'getAllEntities') continue;
          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              'getAllEntities',
              originalArgs,
              (draft) => {
                const listsToUpdate = Object.values(draft.byId).filter(
                  (entity) => entity.id === patch.list
                );
                for (const list of listsToUpdate) {
                  list.list_entries.push({
                    ...patch,
                    id: Math.round(1000000 * Math.random() * 1e7)
                  });
                }
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deleteListEntry: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `core/list-entry/${id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Entity'],
      async onQueryStarted(idToDelete, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of entitiesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Entity' }
        ])) {
          if (endpointName !== 'getAllEntities') continue;
          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              'getAllEntities',
              originalArgs,
              (draft) => {
                const listsToUpdate = Object.values(draft.byId).filter(
                  (entity: any) => {
                    if (entity.resourcetype !== 'List') {
                      return false;
                    }
                    const listEntryIds = entity.list_entries.map(
                      (list: any) => list.id
                    );
                    return listEntryIds.includes(idToDelete);
                  }
                );
                for (const list of listsToUpdate) {
                  list.list_entries = list.list_entries.filter(
                    (listEntry: any) => listEntry.id !== idToDelete
                  );
                }
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    getAllPlanningLists: builder.query<AllPlanningLists, void>({
      query: () => ({
        url: 'core/planning-list/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PlanningList[] = await response.json();
            return normalisePlanningLists(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['PlanningList']
    }),
    createPlanningList: builder.mutation<
      PlanningList,
      Omit<PlanningList, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/planning-list/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['PlanningList'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningList' }
        ])) {
          if (endpointName !== 'getAllPlanningLists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningLists',
              originalArgs,
              (draft) => {
                const mockId = Math.round(1000000 * Math.random() * 1e7);
                draft.ids.push(mockId);
                draft.byId[mockId] = { ...patch, id: mockId };

                const byCat = draft.byCategory[patch.category];
                draft.byCategory[patch.category] = byCat
                  ? [...byCat, mockId]
                  : [mockId];
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deletePlanningList: builder.mutation<void, number>({
      query: (listId) => {
        return {
          url: `core/planning-list/${listId}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['PlanningList'],
      async onQueryStarted(listId, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningList' }
        ])) {
          if (endpointName !== 'getAllPlanningLists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningLists',
              originalArgs,
              (draft) => {
                const cat = draft.byId[listId].category;

                draft.ids = draft.ids.filter((id) => id !== listId);
                delete draft.byId[listId];

                const byCat = draft.byCategory[cat];
                draft.byCategory[cat] = byCat.filter((id) => id !== listId);
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    updatePlanningList: builder.mutation<
      PlanningList,
      Partial<PlanningList> & Pick<PlanningList, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/planning-list/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['PlanningList'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningList' }
        ])) {
          if (endpointName !== 'getAllPlanningLists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningLists',
              originalArgs,
              (draft) => {
                draft.byId[patch.id] = {
                  ...draft.byId[patch.id],
                  ...patch
                };
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    getAllPlanningSublists: builder.query<AllPlanningSublists, void>({
      query: () => ({
        url: 'core/planning-sublist/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PlanningSublist[] = await response.json();
            return normalisePlanningSublists(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['PlanningSublist']
    }),
    createPlanningSublist: builder.mutation<
      PlanningSublist,
      Omit<PlanningSublist, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/planning-sublist/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['PlanningSublist'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningSublist' }
        ])) {
          if (endpointName !== 'getAllPlanningSublists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningSublists',
              originalArgs,
              (draft) => {
                const mockId = Math.round(1000000 * Math.random() * 1e7);
                draft.ids.push(mockId);
                draft.byId[mockId] = { ...patch, id: mockId };

                const byList = draft.byList[patch.list];
                draft.byList[patch.list] = byList
                  ? [...byList, mockId]
                  : [mockId];
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deletePlanningSublist: builder.mutation<void, number>({
      query: (sublistId) => {
        return {
          url: `core/planning-sublist/${sublistId}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['PlanningSublist'],
      async onQueryStarted(sublistId, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningSublist' }
        ])) {
          if (endpointName !== 'getAllPlanningSublists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningSublists',
              originalArgs,
              (draft) => {
                const list = draft.byId[sublistId].list;

                draft.ids = draft.ids.filter((id) => id !== sublistId);
                delete draft.byId[sublistId];

                const byList = draft.byList[list];
                draft.byList[list] = byList.filter((id) => id !== sublistId);
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    getAllPlanningListItems: builder.query<AllPlanningListItems, void>({
      query: () => ({
        url: 'core/planning-list-item/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PlanningListItem[] = await response.json();
            return normalisePlanningListItems(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['PlanningListItem']
    }),
    createPlanningListItem: builder.mutation<
      PlanningListItem,
      Omit<PlanningListItem, 'id' | 'checked'>
    >({
      query: (body) => {
        return {
          url: 'core/planning-list-item/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['PlanningListItem'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningListItem' }
        ])) {
          if (endpointName !== 'getAllPlanningListItems') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningListItems',
              originalArgs,
              (draft) => {
                const mockId = Math.round(1000000 * Math.random() * 1e7);
                draft.ids.push(mockId);
                draft.byId[mockId] = { ...patch, id: mockId, checked: false };

                const bySublist = draft.bySublist[patch.sublist];
                draft.bySublist[patch.sublist] = bySublist
                  ? [...bySublist, mockId]
                  : [mockId];
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deletePlanningListItem: builder.mutation<void, number>({
      query: (itemId) => {
        return {
          url: `core/planning-list-item/${itemId}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['PlanningListItem'],
      async onQueryStarted(itemId, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningListItem' }
        ])) {
          if (endpointName !== 'getAllPlanningListItems') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningListItems',
              originalArgs,
              (draft) => {
                const sublist = draft.byId[itemId].sublist;

                draft.ids = draft.ids.filter((id) => id !== itemId);
                delete draft.byId[itemId];

                const bySublist = draft.bySublist[sublist];
                draft.bySublist[sublist] = bySublist.filter(
                  (id) => id !== itemId
                );
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    updatePlanningListItem: builder.mutation<
      PlanningListItem,
      Partial<PlanningListItem> & Pick<PlanningListItem, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/planning-list-item/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['PlanningListItem'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'PlanningListItem' }
        ])) {
          if (endpointName !== 'getAllPlanningListItems') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllPlanningListItems',
              originalArgs,
              (draft) => {
                draft.byId[patch.id] = {
                  ...draft.byId[patch.id],
                  ...patch
                };
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    getAllShoppingLists: builder.query<AllPlanningLists, void>({
      query: () => ({
        url: 'core/shopping-list/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PlanningList[] = await response.json();
            return normalisePlanningLists(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['ShoppingList']
    }),
    createShoppingList: builder.mutation<
      PlanningList,
      Omit<PlanningList, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/shopping-list/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['ShoppingList'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingList' }
        ])) {
          if (endpointName !== 'getAllShoppingLists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingLists',
              originalArgs,
              (draft) => {
                const mockId = Math.round(1000000 * Math.random() * 1e7);
                draft.ids.push(mockId);
                draft.byId[mockId] = { ...patch, id: mockId };

                const byCat = draft.byCategory[patch.category];
                draft.byCategory[patch.category] = byCat
                  ? [...byCat, mockId]
                  : [mockId];
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deleteShoppingList: builder.mutation<void, number>({
      query: (listId) => {
        return {
          url: `core/shopping-list/${listId}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['ShoppingList'],
      async onQueryStarted(listId, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingList' }
        ])) {
          if (endpointName !== 'getAllShoppingLists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingLists',
              originalArgs,
              (draft) => {
                const cat = draft.byId[listId].category;

                draft.ids = draft.ids.filter((id) => id !== listId);
                delete draft.byId[listId];

                const byCat = draft.byCategory[cat];
                draft.byCategory[cat] = byCat.filter((id) => id !== listId);
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    updateShoppingList: builder.mutation<
      PlanningList,
      Partial<PlanningList> & Pick<PlanningList, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/shopping-list/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['ShoppingList'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingList' }
        ])) {
          if (endpointName !== 'getAllShoppingLists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingLists',
              originalArgs,
              (draft) => {
                draft.byId[patch.id] = {
                  ...draft.byId[patch.id],
                  ...patch
                };
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    getAllShoppingSublists: builder.query<AllPlanningSublists, void>({
      query: () => ({
        url: 'core/shopping-sublist/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PlanningSublist[] = await response.json();
            return normalisePlanningSublists(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['ShoppingSublist']
    }),
    createShoppingSublist: builder.mutation<
      PlanningSublist,
      Omit<PlanningSublist, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/shopping-sublist/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['ShoppingSublist'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingSublist' }
        ])) {
          if (endpointName !== 'getAllShoppingSublists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingSublists',
              originalArgs,
              (draft) => {
                const mockId = Math.round(1000000 * Math.random() * 1e7);
                draft.ids.push(mockId);
                draft.byId[mockId] = { ...patch, id: mockId };

                const byList = draft.byList[patch.list];
                draft.byList[patch.list] = byList
                  ? [...byList, mockId]
                  : [mockId];
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deleteShoppingSublist: builder.mutation<void, number>({
      query: (sublistId) => {
        return {
          url: `core/shopping-sublist/${sublistId}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['ShoppingSublist'],
      async onQueryStarted(sublistId, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingSublist' }
        ])) {
          if (endpointName !== 'getAllShoppingSublists') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingSublists',
              originalArgs,
              (draft) => {
                const list = draft.byId[sublistId].list;

                draft.ids = draft.ids.filter((id) => id !== sublistId);
                delete draft.byId[sublistId];

                const byList = draft.byList[list];
                draft.byList[list] = byList.filter((id) => id !== sublistId);
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    getAllShoppingListItems: builder.query<AllPlanningListItems, void>({
      query: () => ({
        url: 'core/shopping-list-item/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PlanningListItem[] = await response.json();
            return normalisePlanningListItems(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['ShoppingListItem']
    }),
    createShoppingListItem: builder.mutation<
      PlanningListItem,
      Omit<PlanningListItem, 'id' | 'checked'>
    >({
      query: (body) => {
        return {
          url: 'core/shopping-list-item/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['ShoppingListItem'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingListItem' }
        ])) {
          if (endpointName !== 'getAllShoppingListItems') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingListItems',
              originalArgs,
              (draft) => {
                const mockId = Math.round(1000000 * Math.random() * 1e7);
                draft.ids.push(mockId);
                draft.byId[mockId] = { ...patch, id: mockId, checked: false };

                const bySublist = draft.bySublist[patch.sublist];
                draft.bySublist[patch.sublist] = bySublist
                  ? [...bySublist, mockId]
                  : [mockId];
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deleteShoppingListItem: builder.mutation<void, number>({
      query: (itemId) => {
        return {
          url: `core/shopping-list-item/${itemId}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['ShoppingListItem'],
      async onQueryStarted(itemId, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingListItem' }
        ])) {
          if (endpointName !== 'getAllShoppingListItems') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingListItems',
              originalArgs,
              (draft) => {
                const sublist = draft.byId[itemId].sublist;

                draft.ids = draft.ids.filter((id) => id !== itemId);
                delete draft.byId[itemId];

                const bySublist = draft.bySublist[sublist];
                draft.bySublist[sublist] = bySublist.filter(
                  (id) => id !== itemId
                );
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    updateShoppingListItem: builder.mutation<
      PlanningListItem,
      Partial<PlanningListItem> & Pick<PlanningListItem, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/shopping-list-item/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['ShoppingListItem'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of listsApi.util.selectInvalidatedBy(getState(), [
          { type: 'ShoppingListItem' }
        ])) {
          if (endpointName !== 'getAllShoppingListItems') continue;
          const patchResult = dispatch(
            listsApi.util.updateQueryData(
              'getAllShoppingListItems',
              originalArgs,
              (draft) => {
                draft.byId[patch.id] = {
                  ...draft.byId[patch.id],
                  ...patch
                };
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    })
  }),
  overrideExisting: true
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpdateListEntryMutation,
  useCreateListEntryMutation,
  useDeleteListEntryMutation,
  useFormUpdateListEntryMutation,
  useGetAllPlanningListsQuery,
  useCreatePlanningListMutation,
  useDeletePlanningListMutation,
  useUpdatePlanningListMutation,
  useGetAllPlanningSublistsQuery,
  useCreatePlanningSublistMutation,
  useDeletePlanningSublistMutation,
  useGetAllPlanningListItemsQuery,
  useCreatePlanningListItemMutation,
  useDeletePlanningListItemMutation,
  useUpdatePlanningListItemMutation,
  useGetAllShoppingListsQuery,
  useCreateShoppingListMutation,
  useDeleteShoppingListMutation,
  useUpdateShoppingListMutation,
  useGetAllShoppingSublistsQuery,
  useCreateShoppingSublistMutation,
  useDeleteShoppingSublistMutation,
  useGetAllShoppingListItemsQuery,
  useCreateShoppingListItemMutation,
  useDeleteShoppingListItemMutation,
  useUpdateShoppingListItemMutation
} = listsApi;
