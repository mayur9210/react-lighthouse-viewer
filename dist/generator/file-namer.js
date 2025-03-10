/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */

/**
 * Generate a filenamePrefix of name_YYYY-MM-DD_HH-MM-SS
 * Date/time uses the local timezone, however Node has unreliable ICU
 * support, so we must construct a YYYY-MM-DD date format manually. :/
 * @param {string} name
 * @param {string|undefined} fetchTime
 */

function getFilenamePrefix(name, fetchTime) {
  const date = fetchTime ? new Date(fetchTime) : new Date();
  const timeStr = date.toLocaleTimeString('en-US', {
    hour12: false
  });
  const dateParts = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/'); // @ts-expect-error - parts exists

  dateParts.unshift(dateParts.pop());
  const dateStr = dateParts.join('-');
  const filenamePrefix = `${name}_${dateStr}_${timeStr}`; // replace characters that are unfriendly to filenames

  return filenamePrefix.replace(/[/?<>\\:*|"]/g, '-');
}
/**
 * Generate a filenamePrefix of hostname_YYYY-MM-DD_HH-MM-SS.
 * @param {{finalUrl: string, fetchTime: string}} lhr
 * @return {string}
 */


function getLhrFilenamePrefix(lhr) {
  const hostname = new URL(lhr.finalUrl).hostname;
  return getFilenamePrefix(hostname, lhr.fetchTime);
}
/**
 * Generate a filenamePrefix of name_YYYY-MM-DD_HH-MM-SS.
 * @param {{name: string, steps: Array<{lhr: {fetchTime: string}}>}} flowResult
 * @return {string}
 */


function getFlowResultFilenamePrefix(flowResult) {
  const lhr = flowResult.steps[0].lhr;
  const name = flowResult.name.replace(/\s/g, '-');
  return getFilenamePrefix(name, lhr.fetchTime);
}

module.exports = {
  getLhrFilenamePrefix,
  getFilenamePrefix,
  getFlowResultFilenamePrefix
};