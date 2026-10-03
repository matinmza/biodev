/**
 * Root layout for `/` alone. The localized site has its own root layout in
 * `[lang]/`; this one exists only so the redirect page below can render
 * without pulling in the desktop's fonts, styles and providers.
 */
export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
