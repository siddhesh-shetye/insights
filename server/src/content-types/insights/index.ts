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
      "required": false
    },
    "medium": {
      "type": "string",
      "required": false
    },
    "campaign": {
      "type": "string",
      "required": false
    },
    "term": {
      "type": "string",
      "required": false
    },
    "content": {
      "type": "string",
      "required": false
    },
    "path": {
      "type": "string",
      "required": false
    },
    "ip": {
      "type": "string",
      "required": false
    },
    "user_agent": {
      "type": "string",
      "required": false
    },
    "via": {
      "type": "string",
      "required": false
    }
  }
};