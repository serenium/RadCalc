// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md

import { html } from 'lit';

if (!(globalThis as any).URLPattern) {
  await import("urlpattern-polyfill");
}

import { Router } from '@thepassle/app-tools/router.js';
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js';

// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/app-home.js';


// Shared isotope state key
const SHARED_ISOTOPE_KEY = 'shared.selectedIsotope';

function getSharedIsotope(): string {
  return localStorage.getItem(SHARED_ISOTOPE_KEY) || '';
}

function setSharedIsotope(isotope: string) {
  localStorage.setItem(SHARED_ISOTOPE_KEY, isotope);
}

// Listen for isotope-change events from calculators and update shared state
function onIsotopeChange(e: CustomEvent) {
  if (e && e.detail && e.detail.isotope) {
    setSharedIsotope(e.detail.isotope);
  }
}




const baseURL: string = (import.meta as any).env.BASE_URL;

export const router = new Router({
    routes: [
      {
        path: resolveRouterPath(),
        title: 'Home',
        render: () => html`<app-home></app-home>`
      },
      {
        path: resolveRouterPath('about'),
        title: 'About',
        plugins: [
          lazy(() => import('./pages/app-about/app-about.js')),
        ],
        render: () => html`<app-about></app-about>`
      },
      {
        path: resolveRouterPath('decay-calc'),
        title: 'Decay Calculator',
        plugins: [
          lazy(() => import('./pages/decay-calc/decay-calc.js')),
        ],
        render: () => {
          const selectedIsotope = getSharedIsotope();
          return html`<decay-calc .selectedIsotope=${selectedIsotope} @isotope-change=${onIsotopeChange}></decay-calc>`;
        }
      },
      {
        path: resolveRouterPath('unit-convert'),
        title: 'Unit Converter',
        plugins: [
          lazy(() => import('./pages/unit-convert/unit-convert.js')),
        ],
        render: () => {
          const selectedIsotope = getSharedIsotope();
          return html`<unit-convert .selectedIsotope=${selectedIsotope} @isotope-change=${onIsotopeChange}></unit-convert>`;
        }
      },

      {
        path: resolveRouterPath('activity-dose-calc'),
        title: 'Activity ↔ Dose Calculator',
        plugins: [
          lazy(() => import('./pages/activity-dose-calc/activity-dose-calc.js')),
        ],
        render: () => html`<activity-dose-calc></activity-dose-calc>`
      },
      {
        path: resolveRouterPath('reverse-decay-calc'),
        title: 'Reverse Decay Calculator',
        plugins: [
          lazy(() => import('./pages/reverse-decay-calc/reverse-decay-calc.js')),
        ],
        render: () => {
          const selectedIsotope = getSharedIsotope();
          return html`<reverse-decay-calc .selectedIsotope=${selectedIsotope} @isotope-change=${onIsotopeChange}></reverse-decay-calc>`;
        }
      }
    ]
  });

  // This function will resolve a path with whatever Base URL was passed to the vite build process.
  // Use of this function throughout the starter is not required, but highly recommended, especially if you plan to use GitHub Pages to deploy.
  // If no arg is passed to this function, it will return the base URL.

  export function resolveRouterPath(unresolvedPath?: string) {
    var resolvedPath = baseURL;
    if(unresolvedPath) {
      resolvedPath = resolvedPath + unresolvedPath;
    }

    return resolvedPath;
  }
