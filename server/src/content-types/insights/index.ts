export default {
  "kind": "collectionType",
  "collectionName": "insights",
  "info": {
    "singularName": "insight",
    "pluralName": "insights",
    "displayName": "Insights",
    "description": ""
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {
    "content-manager": {
      visible: true
    },
    "content-type-builder": {
      visible: true
    }
  },
  "attributes": {
    "source": {
      "type": "string",
      "required": true
    },
    "medium": {
      "type": "string",
      "required": true
    },
    "campagin": {
      "type": "string",
      "required": true
    },
    "term": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "string",
      "required": true
    },
    "path": {
      "type": "string",
      "required": true
    },
    "ip": {
      "type": "string",
      "required": true
    },
    "user_agent": {
      "type": "string",
      "required": true
    },
    "via": {
      "type": "string",
      "required": true
    }
  }
};