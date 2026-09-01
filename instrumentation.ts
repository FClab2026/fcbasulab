/**
 * Configures a global HTTP/HTTPS proxy for server-side requests.
 *
 * If the `HTTPS_PROXY` environment variable is defined, an Undici
 * `ProxyAgent` is created and registered as the global dispatcher,
 * causing supported Node.js HTTP/HTTPS requests to use the configured proxy.
 *
 * This is primarily intended for server environments where outbound
 * network access requires a proxy.
 */

import { ProxyAgent, setGlobalDispatcher } from "undici";

export async function register() {
  const proxy = process.env.HTTPS_PROXY;

  if (proxy) {
    setGlobalDispatcher(new ProxyAgent(proxy));
  }
}