import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import "./i18n";
import AppRoutes from "./routes.jsx";

import ThemeProvider from "./providers/ThemeProvider.jsx";
import QueryProvider from "./providers/QueryProvider.jsx";
import SocketProvider from "./providers/SocketProvider.jsx";

import ErrorBoundary from "./ErrorBoundary.jsx";
import ErrorFallback from "../pages/ErrorFallback.jsx";
import FullScreenLoader from "../components/ui/FullScreenLoader.jsx";

import store from "../store/index.js";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <QueryProvider>
          <SocketProvider>
            <ErrorBoundary fallback={<ErrorFallback />}>
              <Suspense fallback={<FullScreenLoader />}>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </Suspense>
            </ErrorBoundary>
          </SocketProvider>
        </QueryProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
