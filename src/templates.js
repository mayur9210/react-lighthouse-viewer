export default `<!--
@license
Copyright 2018 The Lighthouse Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<!-- Lighthouse run warnings -->
<template id="warningsToplevel">
  <div class="lh-warnings lh-warnings--toplevel">
    <p class="lh-warnings__msg"></p>
    <ul></ul>
  </div>
</template>

<!-- Lighthouse score scale -->
<template id="scorescale">
  <div class="lh-scorescale">
      <span class="lh-scorescale-range lh-scorescale-range--fail">0&ndash;49</span>
      <span class="lh-scorescale-range lh-scorescale-range--average">50&ndash;89</span>
      <span class="lh-scorescale-range lh-scorescale-range--pass">90&ndash;100</span>
  </div>
</template>

<!-- Toggle arrow chevron -->
<template id="chevron">
  <svg class="lh-chevron" viewbox="0 0 100 100">
    <g class="lh-chevron__lines">
      <path class="lh-chevron__line lh-chevron__line-left" d="M10 50h40"></path>
      <path class="lh-chevron__line lh-chevron__line-right" d="M90 50H50"></path>
    </g>
  </svg>
</template>

<!-- Lighthouse category header -->
<template id="categoryHeader">
  <div class="lh-category-header">
    <div class="lh-score__gauge" role="heading" aria-level="2"></div>
    <div class="lh-category-header__description"></div>
  </div>
</template>

<!-- Lighthouse clump -->
<template id="clump">
  <div class="lh-audit-group">
  <!-- TODO: group classes shouldn't be reused for clumps. -->
  <details class="lh-clump">
    <summary>
      <div class="lh-audit-group__summary">
        <div class="lh-audit-group__header">
          <span class="lh-audit-group__title"></span>
          <span class="lh-audit-group__itemcount"></span>
          <!-- .lh-audit-group__description will be added here -->
          <!-- .lh-metrics-toggle will be added here -->
        </div>
        <div class="lh-clump-toggle">
          <span class="lh-clump-toggletext--show"></span>
          <span class="lh-clump-toggletext--hide"></span>
        </div>
      </div>
    </summary>
  </details>
  </div>
</template>

<!-- Lighthouse audit -->
<template id="audit">
  <div class="lh-audit">
    <details class="lh-expandable-details">
      <summary>
        <div class="lh-audit__header lh-expandable-details__summary">
          <span class="lh-audit__score-icon"></span>
          <span class="lh-audit__title-and-text">
            <span class="lh-audit__title"></span>
            <span class="lh-audit__display-text"></span>
          </span>
          <div class="lh-chevron-container"></div>
        </div>
      </summary>
      <div class="lh-audit__description"></div>
      <div class="lh-audit__stackpacks"></div>
    </details>
  </div>
</template>

<!-- Lighthouse perf metric -->
<template id="metric">
  <div class="lh-metric">
    <div class="lh-metric__innerwrap">
      <div class="lh-metric__icon"></div>
      <span class="lh-metric__title"></span>
      <div class="lh-metric__value"></div>
      <div class="lh-metric__description"></div>
    </div>
  </div>
</template>

<!-- Lighthouse perf opportunity -->
<template id="opportunity">
  <div class="lh-audit lh-audit--load-opportunity">
    <details class="lh-expandable-details">
        <summary>
          <div class="lh-audit__header">
            <div class="lh-load-opportunity__cols">
              <div class="lh-load-opportunity__col lh-load-opportunity__col--one">
                <span class="lh-audit__score-icon"></span>
                <div class="lh-audit__title"></div>
              </div>
              <div class="lh-load-opportunity__col lh-load-opportunity__col--two">
                <div class="lh-load-opportunity__sparkline">
                  <div class="lh-sparkline"><div class="lh-sparkline__bar"></div></div>
                </div>
                <div class="lh-audit__display-text"></div>
                <div class="lh-chevron-container"></div>
              </div>
            </div>
          </div>
        </summary>
      <div class="lh-audit__description"></div>
      <div class="lh-audit__stackpacks"></div>
    </details>
  </div>
</template>

<!-- Lighthouse perf opportunity header -->
<template id="opportunityHeader">
  <div class="lh-load-opportunity__header lh-load-opportunity__cols">
    <div class="lh-load-opportunity__col lh-load-opportunity__col--one"></div>
    <div class="lh-load-opportunity__col lh-load-opportunity__col--two"></div>
  </div>
</template>

<!-- Lighthouse score container -->
<template id="scoresWrapper">
  <style>
    .lh-scores-container {
      display: flex;
      flex-direction: column;
      padding: var(--default-padding) 0;
      position: relative;
      width: 100%;
    }

    .lh-sticky-header {
      --gauge-circle-size: var(--gauge-circle-size-sm);
      --plugin-badge-size: 16px;
      --plugin-icon-size: 75%;
      --gauge-wrapper-width: 60px;
      --gauge-percentage-font-size: 13px;
      position: fixed;
      left: 0;
      right: 0;
      top: var(--topbar-height);
      font-weight: 500;
      display: none;
      justify-content: center;
      background-color: var(--sticky-header-background-color);
      border-bottom: 1px solid var(--color-gray-200);
      padding-top: var(--score-container-padding);
      padding-bottom: 4px;
      z-index: 1;
      pointer-events: none;
    }

    .lh-devtools .lh-sticky-header {
      /* The report within DevTools is placed in a container with overflow, which changes the placement of this header unless we change position to sticky. */
      position: sticky;
    }

    .lh-sticky-header--visible {
      display: grid;
      grid-auto-flow: column;
      pointer-events: auto;
    }

    /* Disable the gauge arc animation for the sticky header, so toggling display: none
       does not play the animation. */
    .lh-sticky-header .lh-gauge-arc {
      animation: none;
    }

    .lh-sticky-header .lh-gauge__label {
      display: none;
    }

    .lh-highlighter {
      width: var(--gauge-wrapper-width);
      height: 1px;
      background-color: var(--highlighter-background-color);
      /* Position at bottom of first gauge in sticky header. */
      position: absolute;
      grid-column: 1;
      bottom: -1px;
    }

    .lh-gauge__wrapper:first-of-type {
      contain: none;
    }
  </style>
  <div class="lh-scores-wrapper">
    <div class="lh-scores-container">
      <div class="lh-pyro">
        <div class="lh-before"></div>
        <div class="lh-after"></div>
      </div>
    </div>
  </div>
</template>

<!-- Lighthouse topbar -->
<template id="topbar">
  <style>
    .lh-topbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      height: var(--topbar-height);
      padding: var(--topbar-padding);
      font-size: var(--report-font-size-secondary);
      background-color: var(--topbar-background-color);
      border-bottom: 1px solid var(--color-gray-200);
    }

    .lh-topbar__logo {
      width: var(--topbar-logo-size);
      height: var(--topbar-logo-size);
      user-select: none;
      flex: none;
    }

    .lh-topbar__url {
      margin: var(--topbar-padding);
      text-decoration: none;
      color: var(--report-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .lh-tools {
      display: flex;
      align-items: center;
      margin-left: auto;
      will-change: transform;
      min-width: var(--report-icon-size);
    }
    .lh-tools__button {
      width: var(--report-icon-size);
      min-width: 24px;
      height: var(--report-icon-size);
      cursor: pointer;
      margin-right: 5px;
      /* This is actually a button element, but we want to style it like a transparent div. */
      display: flex;
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      outline: inherit;
    }
    .lh-tools__button svg {
      fill: var(--tools-icon-color);
    }
    .lh-dark .lh-tools__button svg {
      filter: invert(1);
    }
    .lh-tools__button.lh-active + .lh-tools__dropdown {
      opacity: 1;
      clip: rect(-1px, 194px, 242px, -3px);
      visibility: visible;
    }
    .lh-tools__dropdown {
      position: absolute;
      background-color: var(--report-background-color);
      border: 1px solid var(--report-border-color);
      border-radius: 3px;
      padding: calc(var(--default-padding) / 2) 0;
      cursor: pointer;
      top: 36px;
      right: 0;
      box-shadow: 1px 1px 3px #ccc;
      min-width: 125px;
      clip: rect(0, 164px, 0, 0);
      visibility: hidden;
      opacity: 0;
      transition: all 200ms cubic-bezier(0,0,0.2,1);
    }
    .lh-tools__dropdown a {
      color: currentColor;
      text-decoration: none;
      white-space: nowrap;
      padding: 0 6px;
      line-height: 2;
    }
    .lh-tools__dropdown a:hover,
    .lh-tools__dropdown a:focus {
      background-color: var(--color-gray-200);
      outline: none;
    }
    /* save-gist option hidden in report. */
    .lh-tools__dropdown a[data-action='save-gist'] {
      display: none;
    }

    .lh-locale-selector {
      width: 100%;
      color: var(--report-text-color);
      background-color: var(--locale-selector-background-color);
      padding: 2px;
    }
    .lh-tools-locale {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
    .lh-tools-locale__selector-wrapper {
      transition: opacity 0.15s;
      opacity: 0;
      max-width: 200px;
    }
    .lh-button.lh-tool-locale__button {
      height: var(--topbar-height);
      color: var(--tools-icon-color);
      padding: calc(var(--default-padding) / 2);
    }
    .lh-tool-locale__button.lh-active + .lh-tools-locale__selector-wrapper {
      opacity: 1;
      clip: rect(-1px, 194px, 242px, -3px);
      visibility: visible;
      margin: 0 4px;
    }

    @media screen and (max-width: 964px) {
      .lh-tools__dropdown {
        right: 0;
        left: initial;
      }
    }
    @media print {
      .lh-topbar {
        position: static;
        margin-left: 0;
      }

      .lh-tools__dropdown {
        display: none;
      }
    }
  </style>

  <div class="lh-topbar">
    <!-- Lighthouse logo.  -->
    <svg class="lh-topbar__logo" viewBox="0 0 24 24">
      <defs>
        <linearGradient x1="57.456%" y1="13.086%" x2="18.259%" y2="72.322%" id="lh-topbar__logo--a">
          <stop stop-color="#262626" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#262626" stop-opacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="100%" y1="50%" x2="0%" y2="50%" id="lh-topbar__logo--b">
          <stop stop-color="#262626" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#262626" stop-opacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="58.764%" y1="65.756%" x2="36.939%" y2="50.14%" id="lh-topbar__logo--c">
          <stop stop-color="#262626" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#262626" stop-opacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="41.635%" y1="20.358%" x2="72.863%" y2="85.424%" id="lh-topbar__logo--d">
          <stop stop-color="#FFF" stop-opacity=".1" offset="0%"/>
          <stop stop-color="#FFF" stop-opacity="0" offset="100%"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <path d="M12 3l4.125 2.625v3.75H18v2.25h-1.688l1.5 9.375H6.188l1.5-9.375H6v-2.25h1.875V5.648L12 3zm2.201 9.938L9.54 14.633 9 18.028l5.625-2.062-.424-3.028zM12.005 5.67l-1.88 1.207v2.498h3.75V6.86l-1.87-1.19z" fill="#F44B21"/>
        <path fill="#FFF" d="M14.201 12.938L9.54 14.633 9 18.028l5.625-2.062z"/>
        <path d="M6 18c-2.042 0-3.95-.01-5.813 0l1.5-9.375h4.326L6 18z" fill="url(#lh-topbar__logo--a)" fill-rule="nonzero" transform="translate(6 3)"/>
        <path fill="#FFF176" fill-rule="nonzero" d="M13.875 9.375v-2.56l-1.87-1.19-1.88 1.207v2.543z"/>
        <path fill="url(#lh-topbar__logo--b)" fill-rule="nonzero" d="M0 6.375h6v2.25H0z" transform="translate(6 3)"/>
        <path fill="url(#lh-topbar__logo--c)" fill-rule="nonzero" d="M6 6.375H1.875v-3.75L6 0z" transform="translate(6 3)"/>
        <path fill="url(#lh-topbar__logo--d)" fill-rule="nonzero" d="M6 0l4.125 2.625v3.75H12v2.25h-1.688l1.5 9.375H.188l1.5-9.375H0v-2.25h1.875V2.648z" transform="translate(6 3)"/>
      </g>
    </svg>

    <a href="" class="lh-topbar__url" target="_blank" rel="noopener"></a>

    <div class="lh-tools">
      <div class="lh-tools-locale lh-hidden">
        <button id="lh-button__swap-locales" class="lh-button lh-tool-locale__button" title="Show Language Picker" aria-label="Toggle language picker" aria-haspopup="menu" aria-expanded="false" aria-controls="lh-tools-locale__selector-wrapper">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
        </button>
        <div id="lh-tools-locale__selector-wrapper" class="lh-tools-locale__selector-wrapper" role="menu" aria-labelledby="lh-button__swap-locales" aria-hidden="true">
          <!-- Select element created by ReportUIFeatures._enableSwapLocale: .lh-locale-selector -->
        </div>
      </div>

      <button id="lh-tools-button" class="lh-tools__button" title="Tools menu" aria-label="Toggle report tools menu" aria-haspopup="menu" aria-expanded="false" aria-controls="lh-tools-dropdown">
        <svg width="100%" height="100%" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>
      <div id="lh-tools-dropdown" role="menu" class="lh-tools__dropdown" aria-labelledby="lh-tools-button">
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--print" data-i18n="dropdownPrintSummary" data-action="print-summary"></a>
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--print" data-i18n="dropdownPrintExpanded" data-action="print-expanded"></a>
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--copy" data-i18n="dropdownCopyJSON" data-action="copy"></a>
        <!-- Only enabled if Options.getStandaloneReportHTML is set. -->
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--download lh-hidden" data-i18n="dropdownSaveHTML" data-action="save-html"></a>
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--download" data-i18n="dropdownSaveJSON" data-action="save-json"></a>
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--open" data-i18n="dropdownViewer" data-action="open-viewer"></a>
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--open" data-i18n="dropdownSaveGist" data-action="save-gist"></a>
        <a role="menuitem" tabindex="-1" href="#" class="lh-report-icon lh-report-icon--dark" data-i18n="dropdownDarkTheme" data-action="toggle-dark"></a>
      </div>
    </div>
  </div>
</template>

<!-- Lighthouse header -->
<template id="heading">
  <style>
    /* CSS Fireworks. Originally by Eddie Lin
       https://codepen.io/paulirish/pen/yEVMbP
    */
    .lh-pyro {
      display: none;
      z-index: 1;
      pointer-events: none;
    }
    .lh-score100 .lh-pyro {
      display: block;
    }
    .lh-score100 .lh-lighthouse stop:first-child {
      stop-color: hsla(200, 12%, 95%, 0);
    }
    .lh-score100 .lh-lighthouse stop:last-child {
      stop-color: hsla(65, 81%, 76%, 1);
    }

    .lh-pyro > .lh-pyro-before, .lh-pyro > .lh-pyro-after {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 2.5px;
      box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;
      animation: 1s bang ease-out infinite backwards,  1s gravity ease-in infinite backwards,  5s position linear infinite backwards;
      animation-delay: 1s, 1s, 1s;
    }

    .lh-pyro > .lh-pyro-after {
      animation-delay: 2.25s, 2.25s, 2.25s;
      animation-duration: 1.25s, 1.25s, 6.25s;
    }
    .lh-fireworks-paused .lh-pyro > div {
      animation-play-state: paused;
    }

    @keyframes bang {
      to {
        box-shadow: -70px -115.67px #47ebbc, -28px -99.67px #eb47a4, 58px -31.67px #7eeb47, 13px -141.67px #eb47c5, -19px 6.33px #7347eb, -2px -74.67px #ebd247, 24px -151.67px #eb47e0, 57px -138.67px #b4eb47, -51px -104.67px #479eeb, 62px 8.33px #ebcf47, -93px 0.33px #d547eb, -16px -118.67px #47bfeb, 53px -84.67px #47eb83, 66px -57.67px #eb47bf, -93px -65.67px #91eb47, 30px -13.67px #86eb47, -2px -59.67px #83eb47, -44px 1.33px #eb47eb, 61px -58.67px #47eb73, 5px -22.67px #47e8eb, -66px -28.67px #ebe247, 42px -123.67px #eb5547, -75px 26.33px #7beb47, 15px -52.67px #a147eb, 36px -51.67px #eb8347, -38px -12.67px #eb5547, -46px -59.67px #47eb81, 78px -114.67px #eb47ba, 15px -156.67px #eb47bf, -36px 1.33px #eb4783, -72px -86.67px #eba147, 31px -46.67px #ebe247, -68px 29.33px #47e2eb, -55px 19.33px #ebe047, -56px 27.33px #4776eb, -13px -91.67px #eb5547, -47px -138.67px #47ebc7, -18px -96.67px #eb47ac, 11px -88.67px #4783eb, -67px -28.67px #47baeb, 53px 10.33px #ba47eb, 11px 19.33px #5247eb, -5px -11.67px #eb4791, -68px -4.67px #47eba7, 95px -37.67px #eb478b, -67px -162.67px #eb5d47, -54px -120.67px #eb6847, 49px -12.67px #ebe047, 88px 8.33px #47ebda, 97px 33.33px #eb8147, 6px -71.67px #ebbc47;
      }
    }
    @keyframes gravity {
      to {
        transform: translateY(80px);
        opacity: 0;
      }
    }
    @keyframes position {
      0%, 19.9% {
        margin-top: 4%;
        margin-left: 47%;
      }
      20%, 39.9% {
        margin-top: 7%;
        margin-left: 30%;
      }
      40%, 59.9% {
        margin-top: 6%;
        margin-left: 70%;
      }
      60%, 79.9% {
        margin-top: 3%;
        margin-left: 20%;
      }
      80%, 99.9% {
        margin-top: 3%;
        margin-left: 80%;
      }
    }
  </style>

  <div class="lh-header-container">
    <div class="lh-scores-wrapper-placeholder"></div>
  </div>
</template>


<!-- Lighthouse footer -->
<template id="footer">
  <style>
    .lh-footer {
      padding: var(--footer-padding-vertical) calc(var(--default-padding) * 2);
      max-width: var(--report-content-max-width);
      margin: 0 auto;
    }
    .lh-footer .lh-generated {
      text-align: center;
    }
  </style>
  <footer class="lh-footer">
    <ul class="lh-meta__items">
    </ul>

    <div class="lh-generated">
      <!-- TODO(i18n): use ICU replacement to replace version w/o concatenation. -->
      Generated by <b>Lighthouse</b> <span class="lh-footer__version"></span> |
      <a href="https://github.com/GoogleChrome/Lighthouse/issues" target="_blank" rel="noopener" class="lh-footer__version_issue">File an issue</a>
    </div>
  </footer>
</template>

<!-- Lighthouse score gauge -->
<template id="gauge">
  <a class="lh-gauge__wrapper">
    <!-- Wrapper exists for the ::before plugin icon. Cannot create pseudo-elements on svgs. -->
    <div class="lh-gauge__svg-wrapper">
      <svg viewBox="0 0 120 120" class="lh-gauge">
        <circle class="lh-gauge-base" r="56" cx="60" cy="60" stroke-width="8"></circle>
        <circle class="lh-gauge-arc"  r="56" cx="60" cy="60" stroke-width="8"></circle>
      </svg>
    </div>
    <div class="lh-gauge__percentage"></div>
    <!-- TODO: should likely be an h2  -->
    <div class="lh-gauge__label"></div>
  </a>
</template>

<!-- Lighthouse category fraction -->
<template id="fraction">
  <a class="lh-fraction__wrapper">
    <div class="lh-fraction__content-wrapper">
      <div class="lh-fraction__content">
        <div class="lh-fraction__background"></div>
      </div>
    </div>
    <div class="lh-fraction__label"></div>
  </a>
</template>


<!-- Lighthouse PWA badge gauge -->
<template id="gaugePwa">
  <style>
    .lh-gauge--pwa .lh-gauge--pwa__component {
      display: none;
    }
    .lh-gauge--pwa__wrapper:not(.lh-badged--all) .lh-gauge--pwa__logo > path {
      /* Gray logo unless everything is passing. */
      fill: #B0B0B0;
    }

    .lh-gauge--pwa__disc {
      fill: var(--color-gray-200);
    }

    .lh-gauge--pwa__logo--primary-color {
      fill: #304FFE;
    }

    .lh-gauge--pwa__logo--secondary-color {
      fill: #3D3D3D;
    }
    .lh-dark .lh-gauge--pwa__logo--secondary-color {
      fill: #D8B6B6;
    }

    /* No passing groups. */
    .lh-gauge--pwa__wrapper:not([class*='lh-badged--']) .lh-gauge--pwa__na-line {
      display: inline;
    }
    /* Just optimized. Same n/a line as no passing groups. */
    .lh-gauge--pwa__wrapper.lh-badged--pwa-optimized:not(.lh-badged--pwa-installable) .lh-gauge--pwa__na-line {
      display: inline;
    }

    /* Just installable. */
    .lh-gauge--pwa__wrapper.lh-badged--pwa-installable .lh-gauge--pwa__installable-badge {
      display: inline;
    }

    /* All passing groups. */
    .lh-gauge--pwa__wrapper.lh-badged--all .lh-gauge--pwa__check-circle {
      display: inline;
    }
  </style>

  <a class="lh-gauge__wrapper lh-gauge--pwa__wrapper">
    <svg viewBox="0 0 60 60" class="lh-gauge lh-gauge--pwa">
      <defs>
        <linearGradient id="lh-gauge--pwa__check-circle__gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop stop-color="#00C852" offset="0%"></stop>
          <stop stop-color="#009688" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="lh-gauge--pwa__installable__shadow-gradient" x1="76.056%" x2="24.111%" y1="82.995%" y2="24.735%">
          <stop stop-color="#A5D6A7" offset="0%"></stop>
          <stop stop-color="#80CBC4" offset="100%"></stop>
        </linearGradient>

        <g id="lh-gauge--pwa__installable-badge">
          <circle fill="#FFFFFF" cx="10" cy="10" r="10"></circle>
          <path fill="#009688" d="M10 4.167A5.835 5.835 0 0 0 4.167 10 5.835 5.835 0 0 0 10 15.833 5.835 5.835 0 0 0 15.833 10 5.835 5.835 0 0 0 10 4.167zm2.917 6.416h-2.334v2.334H9.417v-2.334H7.083V9.417h2.334V7.083h1.166v2.334h2.334v1.166z"/>
        </g>
      </defs>

      <g stroke="none" fill-rule="nonzero">
        <!-- Background and PWA logo (color by default) -->
        <circle class="lh-gauge--pwa__disc" cx="30" cy="30" r="30"></circle>
        <g class="lh-gauge--pwa__logo">
          <path class="lh-gauge--pwa__logo--secondary-color" d="M35.66 19.39l.7-1.75h2L37.4 15 38.6 12l3.4 9h-2.51l-.58-1.61z"/>
          <path class="lh-gauge--pwa__logo--primary-color" d="M33.52 21l3.65-9h-2.42l-2.5 5.82L30.5 12h-1.86l-1.9 5.82-1.35-2.65-1.21 3.72L25.4 21h2.38l1.72-5.2 1.64 5.2z"/>
          <path class="lh-gauge--pwa__logo--secondary-color" fill-rule="nonzero" d="M20.3 17.91h1.48c.45 0 .85-.05 1.2-.15l.39-1.18 1.07-3.3a2.64 2.64 0 0 0-.28-.37c-.55-.6-1.36-.91-2.42-.91H18v9h2.3V17.9zm1.96-3.84c.22.22.33.5.33.87 0 .36-.1.65-.29.87-.2.23-.59.35-1.15.35h-.86v-2.41h.87c.52 0 .89.1 1.1.32z"/>
        </g>

        <!-- No badges. -->
        <rect class="lh-gauge--pwa__component lh-gauge--pwa__na-line" fill="#FFFFFF" x="20" y="32" width="20" height="4" rx="2"></rect>

        <!-- Just installable. -->
        <g class="lh-gauge--pwa__component lh-gauge--pwa__installable-badge" transform="translate(20, 29)">
          <path fill="url(#lh-gauge--pwa__installable__shadow-gradient)" d="M33.629 19.487c-4.272 5.453-10.391 9.39-17.415 10.869L3 17.142 17.142 3 33.63 19.487z"/>
          <use href="#lh-gauge--pwa__installable-badge" />
        </g>

        <!-- Full PWA. -->
        <g class="lh-gauge--pwa__component lh-gauge--pwa__check-circle" transform="translate(18, 28)">
          <circle fill="#FFFFFF" cx="12" cy="12" r="12"></circle>
          <path fill="url(#lh-gauge--pwa__check-circle__gradient)" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
        </g>
      </g>
    </svg>

    <div class="lh-gauge__label"></div>
  </a>
</template>

<!-- Lighthouse crtiical request chains component -->
<template id="crc">
  <div class="lh-crc-container">
    <style>
      .lh-crc .lh-tree-marker {
        width: 12px;
        height: 26px;
        display: block;
        float: left;
        background-position: top left;
      }
      .lh-crc .lh-horiz-down {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><g fill="%23D8D8D8" fill-rule="evenodd"><path d="M16 12v2H-2v-2z"/><path d="M9 12v14H7V12z"/></g></svg>');
      }
      .lh-crc .lh-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M16 12v2H0v-2z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-up-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v14H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-vert-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v27H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-vert {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v26H7z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-crc-tree {
        font-size: 14px;
        width: 100%;
        overflow-x: auto;
      }
      .lh-crc .lh-crc-node {
        height: 26px;
        line-height: 26px;
        white-space: nowrap;
      }
      .lh-crc .lh-crc-node__tree-value {
        margin-left: 10px;
      }
      .lh-crc .lh-crc-node__tree-value div {
        display: inline;
      }
      .lh-crc .lh-crc-node__chain-duration {
        font-weight: 700;
      }
      .lh-crc .lh-crc-initial-nav {
        color: #595959;
        font-style: italic;
      }
      .lh-crc__summary-value {
        margin-bottom: 10px;
      }
    </style>
    <div>
      <div class="lh-crc__summary-value">
        <span class="lh-crc__longest_duration_label"></span> <b class="lh-crc__longest_duration"></b>
      </div>
    </div>
    <div class="lh-crc">
      <div class="lh-crc-initial-nav"></div>
      <!-- crcChain -->
    </div>
  </div>
</template>

<!-- Lighthouse crtiical request chains component, single chain -->
<template id="crcChain">
  <div class="lh-crc-node">
    <span class="lh-crc-node__tree-marker"></span>
    <span class="lh-crc-node__tree-value"></span>
  </div>
</template>

<template id="3pFilter">
  <style>
    .lh-3p-filter {
      color: var(--color-gray-600);
      float: right;
      padding: 6px var(--stackpack-padding-horizontal);
    }
    .lh-3p-filter-label, .lh-3p-filter-input {
      vertical-align: middle;
      user-select: none;
    }
    .lh-3p-filter-input:disabled + .lh-3p-ui-string {
      text-decoration: line-through;
    }
  </style>
  <div class="lh-3p-filter">
    <label class="lh-3p-filter-label">
      <input type="checkbox" class="lh-3p-filter-input" checked />
      <span class="lh-3p-ui-string">Show 3rd party resources</span> (<span class="lh-3p-filter-count"></span>)
    </label>
  </div>
</template>

<!-- Lighthouse snippet component -->
<template id="snippet">
    <div class="lh-snippet">
      <style>
          :root {
            --snippet-highlight-light: #fbf1f2;
            --snippet-highlight-dark: #ffd6d8;
          }

         .lh-snippet__header {
          position: relative;
          overflow: hidden;
          padding: 10px;
          border-bottom: none;
          color: var(--snippet-color);
          background-color: var(--snippet-background-color);
          border: 1px solid var(--report-border-color-secondary);
        }
        .lh-snippet__title {
          font-weight: bold;
          float: left;
        }
        .lh-snippet__node {
          float: left;
          margin-left: 4px;
        }
        .lh-snippet__toggle-expand {
          padding: 1px 7px;
          margin-top: -1px;
          margin-right: -7px;
          float: right;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #0c50c7;
        }

        .lh-snippet__snippet {
          overflow: auto;
          border: 1px solid var(--report-border-color-secondary);
        }
        /* Container needed so that all children grow to the width of the scroll container */
        .lh-snippet__snippet-inner {
          display: inline-block;
          min-width: 100%;
        }

        .lh-snippet:not(.lh-snippet--expanded) .lh-snippet__show-if-expanded {
          display: none;
        }
        .lh-snippet.lh-snippet--expanded .lh-snippet__show-if-collapsed {
          display: none;
        }

        .lh-snippet__line {
          background: white;
          white-space: pre;
          display: flex;
        }
        .lh-snippet__line:not(.lh-snippet__line--message):first-child {
          padding-top: 4px;
        }
        .lh-snippet__line:not(.lh-snippet__line--message):last-child {
          padding-bottom: 4px;
        }
        .lh-snippet__line--content-highlighted {
          background: var(--snippet-highlight-dark);
        }
        .lh-snippet__line--message {
          background: var(--snippet-highlight-light);
        }
        .lh-snippet__line--message .lh-snippet__line-number {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .lh-snippet__line--message code {
          padding: 10px;
          padding-left: 5px;
          color: var(--color-fail);
          font-family: var(--report-font-family);
        }
        .lh-snippet__line--message code {
          white-space: normal;
        }
        .lh-snippet__line-icon {
          padding-top: 10px;
          display: none;
        }
        .lh-snippet__line--message .lh-snippet__line-icon {
          display: block;
        }
        .lh-snippet__line-icon:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          margin-right: 4px;
          width: var(--score-icon-size);
          height: var(--score-icon-size);
          background-image: var(--fail-icon-url);
        }
        .lh-snippet__line-number {
          flex-shrink: 0;
          width: 40px;
          text-align: right;
          font-family: monospace;
          padding-right: 5px;
          margin-right: 5px;
          color: var(--color-gray-600);
          user-select: none;
        }
    </style>
  </div>
</template>

<template id="snippetHeader">
  <div class="lh-snippet__header">
    <div class="lh-snippet__title"></div>
    <div class="lh-snippet__node"></div>
    <button class="lh-snippet__toggle-expand">
      <span class="lh-snippet__btn-label-collapse lh-snippet__show-if-expanded"></span>
      <span class="lh-snippet__btn-label-expand lh-snippet__show-if-collapsed"></span>
    </button>
  </div>
</template>

<template id="snippetContent">
  <div class="lh-snippet__snippet">
    <div class="lh-snippet__snippet-inner"></div>
  </div>
</template>

<template id="snippetLine">
  <div class="lh-snippet__line">
    <div class="lh-snippet__line-number"></div>
    <div class="lh-snippet__line-icon"></div>
    <code></code>
  </div>
</template>

<!-- Lighthouse element screenshot -->
<template id="elementScreenshot">
  <div class="lh-element-screenshot">
    <div class="lh-element-screenshot__content">
      <div class="lh-element-screenshot__mask">
        <svg height="0" width="0">
          <defs>
            <clipPath clipPathUnits="objectBoundingBox"></clipPath>
            <!-- clipPath filled by ElementScreenshotRenderer.renderClipPath -->
          </defs>
        </svg>
      </div>
      <div class="lh-element-screenshot__image"></div>
      <div class="lh-element-screenshot__element-marker"></div>
    </div>
  </div>
</template>


`;
