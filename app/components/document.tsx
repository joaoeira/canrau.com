import { ReactNode } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "remix";
import { useShouldHydrate } from "remix-utils";
import { rootUrl } from "/config";

export function Document({
  children,
  title,
  lang,
}: {
  children: ReactNode;
  title?: string;
  lang: string;
}) {
  // note: use `export const handle = { hydrate: true };` in any route to enable JS
  const includeScripts = useShouldHydrate();
  const matches = useMatches();
  // done: last item in useMatches always correct? get canonical from here as well?
  const currentRoute = matches?.[matches.length - 1];
  const { canonical, jsonld } = currentRoute?.data ?? {};
  // const match = matches.find((match) => match.handle && match.handle.canonical);
  // const match = matches.find((match) => match.data && match.data.canonical);
  // const canonical = match?.data.canonical;

  return (
    <html lang={lang} className="dark scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        {!!canonical && <link rel="canonical" href={canonical} />}
        <Links />

        {/* todo: more meta tags */}
        {/* <meta name="theme-color" content="#fff"></meta> */}

        {/* prettier-ignore */}
        <link rel="alternate" type="application/rss+xml" href={`${rootUrl}/${lang}/feed.xml`} title="Can Rau's XML Feed" />
        {/* prettier-ignore */}
        <link rel="alternate" type="application/feed+json" href={`${rootUrl}/${lang}/feed.json`} title="Can Rau's JSON Feed" />
        {/* Google Search Console */}
        {/* prettier-ignore */}
        <meta name="google-site-verification" content="KGv3z097pffnaQ1ZA4nUtkhyewpwfmUPLxAoPVlyfpw" />
        <link
          rel="sitemap"
          type="application/xml"
          href={`/${lang}/sitemap.xml`}
        />
        {jsonld && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
          />
        )}
      </head>
      <body className="dark:bg-zinc-900">
        {children}
        <ScrollRestoration />
        {includeScripts && <Scripts />}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
