import path from 'path';
import url from 'url';

import processResponse from '../helpers/processResponse';
import ResourceIdentifier from './ResourceIdentifier';
import { NotPersistedError } from '../errors';
import {
  reloadInstance, patchInstance, postInstance, deleteInstance
} from '../helpers/instanceActions';
import { optionsCache } from '../helpers/optionsCache';
import { getRelationshipData } from '../helpers/preparers';

class Instance extends ResourceIdentifier {
  constructor(
    { type, id, attributes, links, meta, relationships } , api, collection
  ) {
    super({
      type,
      id
    });
    this.api = api;
    this.collection = collection;
    this.optionsCache = optionsCache.bind(this);
    this.attributes = Object.freeze(attributes || {});
    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    this.relationships = Object.freeze(relationships);

    Object.freeze(this);
  }

  // Checks whether or not the instance is persisted using a very
  // small response body
  checkPersistence() {
    let instance = this;
    let params = { fields: {} };
    params.fields[this.type] = null;
    if (this.persisted) {
      return Promise.resolve(instance);
    }
    return this.reload(params).then(() => {
      return instance;
    });
  }

  get peristed() {
    return Boolean(this.links.self);
  }

  // Deletes an instance, returning a new instance with the same attributes, but
  // with no ID. The instance can be recreated by calling save() on the instance
  delete(params) {
    return this.checkPersistence().then(
      deleteInstance.bind(undefined, this, params)
    );
  }

  get resource() {
    return this.api.resource(this.type);
  }

  optionsCacheKey(...additions) {
    let parentKey;
    let idKey = this.persisted && this.id ? ':id' : 'new';
    if (this.collection && !this.id) {
      parentKey = this.collection.optionsCacheKey();
    } else {
      parentKey = this.resource.optionsCacheKey();
    }
    return path.join(parentKey, idKey, ...additions);
  }

  // Returns the request options
  options() {
    return this.optionsCache(() => {
      setTimeout(() => delete this.optionsCache[this.optionsCacheKey()], 120);
      return this.api.client.options(this.uri()).then(
        processResponse
      );
    });
  }

  // Fetches the related collection or instance
  related(name, params) {
    const RelatedProxy = require('./RelatedProxy').default;
    return new RelatedProxy(this, name, params);
  }

  // Gets options about the relation
  relatedOptions(name) {
    return this.optionsCache(() => {
      return getRelationshipData(this, name).then(({ data, api }) => {
        return api.client.options(data.links.related);
      }).then(
        processResponse
      );
    }, name);
  }

  // Fetches the relationship
  relationship(name, params) {
    const RelationshipProxy = require('./RelationshipProxy').default;
    return new RelationshipProxy(this, name, params);
  }

  // Reloads the instance, returns a new instance object with the reloaded data
  reload(params) {
    return reloadInstance(this, params);
  }

  // Saves the instance, returns a new object with the saved data.
  save(params) {
    let instance = this;
    return this.checkPersistence().then(() => {
      return patchInstance(instance, params);
    }).catch(error => { // Create the instance
      if (error instanceof NotPersistedError) {
        return postInstance(instance, params);
      }
      throw error;
    });
  }

  update({ attributes, relationships }, params) {
    return this.write(
      { attributes, relationships }
    ).then(
      ({ instance }) => instance.save(params)
    );
  }

  // Updates and returns a new instance object with the updated attributes
  updateAttributes(attributes, params) {
    return this.write({ attributes }).then(({ instance }) => {
      return instance.save(params);
    });
  }

  uri(params = false) {
    let selfUri = this.links.self;
    let parentUri = this.collection && this.collection.uri(false);
    let parts = [this.type]
    if (this.id) {
      parts.push(this.id)
    }
    let resourceUri = parts.join('/');
    let u = url.parse(selfUri || parentUri || resourceUri);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }

  // Writes the new attributes, returns an instance with the newly written
  // attributes
  write({ attributes, relationships }) {
    const { buildInstance } = require('../helpers/builders');
    let newAttributes = {};
    let newRelationships = {};
    let keys = Object.keys(this.attributes).concat(Object.keys(attributes));
    keys.forEach(key => {
      if (attributes[key] !== undefined) {
        newAttributes[key] = attributes[key];
      } else {
        newAttributes[key] = this.attributes[key];
      }
    }, this);

    if (this.relationships) {
      keys.forEach(key => {
        if (attributes[key] !== undefined) {
          newAttributes[key] = attributes[key];
        } else {
          newAttributes[key] = this.attributes[key];
        }
      }, this);
    } else {
      newRelationships = relationships;
    }
    return buildInstance(this, {
      attributes: newAttributes,
      relationships: newRelationships
    });
  }
}

module.exports = Instance;
