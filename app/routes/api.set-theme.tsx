import { createThemeAction } from "remix-themes";

import { themeSessionResolver } from "~/.server/utils/theme.server";

export const action = createThemeAction(themeSessionResolver);
