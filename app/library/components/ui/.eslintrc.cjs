/**
 * @type {import("eslint").Linter.Config}
 */

module.exports = {
  extends: ["eslint:recommended", "plugin:storybook/recommended"],
  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      rules: {
        "react/prop-types": "off"
      }
    }
  ]
}
