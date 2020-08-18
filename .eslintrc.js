{
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-console": "off",
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "quotes": [
      "warn",
      "double"
    ],
    "semi": [
      "warn",
      "always"
    ],
    "keyword-spacing": [
      "error", {
        "before": true,
        "after": true
      }
    ],
    "space-before-blocks": [
      "error", {
        "functions":"always",
        "keywords": "always",
        "classes": "always"
      }
    ],
    "space-before-function-paren": [
      "error", {
        "anonymous": "always",
        "named": "always",
        "asyncArrow": "always"
      }
    ],
    "prefer-const": [
      "error", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false
      }
    ]
  }
}
