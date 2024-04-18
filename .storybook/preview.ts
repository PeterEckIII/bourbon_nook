import type { Preview } from "@storybook/react";
import "../app/tailwind.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    actions: {},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
