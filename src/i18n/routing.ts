import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["th", "hk", "sc", "fr", "be"],
	defaultLocale: "th",
	pathnames: {
		"/": "/",
		"/th": "/th",
		"/hk": "/hk",
		"/sc": "/sc",
		"/fr": "/fr",
		"/be": "/be",
	},
});
