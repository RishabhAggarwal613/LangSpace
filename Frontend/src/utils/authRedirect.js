export function getRedirectPath(location, fallback = "/dashboard") {
  const url = new URL(window.location.href);
  const qp = url.searchParams.get("redirect");
  return location?.state?.from || qp || fallback;
}

