import type { Meta, StoryObj } from "@storybook/react";

import Textbox from "./Textbox";

const meta: Meta<typeof Textbox> = {
  title: "Components/Inputs/Textbox",
  component: Textbox,
};

export default meta;

type Story = StoryObj<typeof Textbox>;

export const Primary: Story = {
  args: {
    label: "First Name",
    type: "text",
    name: "name",
    placeholder: "John",
    error: "",
    navigationState: "idle",
    value: "",
  },
};

export const Error: Story = {
  args: {
    label: "First Name",
    type: "text",
    name: "name",
    placeholder: "John",
    error: "This is an error message",
    navigationState: "idle",
    value: "",
  },
};

export const Loading: Story = {
  args: {
    label: "First Name",
    type: "text",
    name: "name",
    placeholder: "John",
    error: "",
    navigationState: "loading",
    value: "",
  },
};

export const Submitting: Story = {
  args: {
    label: "First Name",
    type: "text",
    name: "name",
    placeholder: "John",
    error: "",
    navigationState: "submitting",
    value: "",
  },
};

export const WithValue: Story = {
  args: {
    label: "First Name",
    type: "text",
    name: "name",
    placeholder: "John",
    error: "",
    navigationState: "idle",
    value: "John",
  },
};

export const Email: Story = {
  args: {
    label: "Email",
    type: "email",
    name: "email",
    placeholder: "example@gmail.com",
    error: "",
    navigationState: "idle",
    value: "",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "********",
    error: "",
    navigationState: "idle",
    value: "",
  },
};
