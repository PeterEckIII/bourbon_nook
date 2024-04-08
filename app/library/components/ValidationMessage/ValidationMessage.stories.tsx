import type { Meta, StoryObj } from "@storybook/react";

import ValidationMessage from "./ValidationMessage";

const meta: Meta<typeof ValidationMessage> = {
  title: "Components/ValidationMessage",
  component: ValidationMessage,
};

export default meta;

type Story = StoryObj<typeof ValidationMessage>;

export const Primary: Story = {
  args: {
    isSubmitting: false,
    error: "This is an error message",
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
    error: "This is an error message",
  },
};

export const NoError: Story = {
  args: {
    isSubmitting: false,
    error: "",
  },
};

export const NoErrorSubmitting: Story = {
  args: {
    isSubmitting: true,
    error: "",
  },
};
