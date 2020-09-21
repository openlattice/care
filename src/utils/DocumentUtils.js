import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

import { PDF_MIME_TYPE, DOCX_MIME_TYPE } from './constants/FileTypeConstants';

const BASE_64_SUBSTR = ';base64,';

export function cleanBase64ForUpload(base64String) {
  const splitPoint = base64String.indexOf(BASE_64_SUBSTR);
  if (splitPoint < 0) {
    return base64String;
  }
  return base64String.substring(splitPoint + BASE_64_SUBSTR.length);
}

function base64ToUint8Array(base64) {
  const raw = atob(cleanBase64ForUpload(base64));
  const uint8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}

function getTextFromDocx(base64) {
  const zipFile = new PizZip(base64ToUint8Array(base64));
  const maybedoc = new Docxtemplater(zipFile);
  const text = maybedoc.getFullText();
  return Promise.resolve(text);
}

function getTextFromPDF(file) {
  GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const pdfObject = getDocument({ data: base64ToUint8Array(file) });
  return pdfObject.promise.then((pdf) => {
    const { _pdfInfo: pdfInfo } = pdf;
    const { numPages } = pdfInfo;

    const countPromises = [];
    for (let j = 1; j <= numPages; j += 1) {
      const pageObject = pdf.getPage(j);

      countPromises.push(pageObject.then((page) => {
        const textContent = page.getTextContent();
        return textContent.then((text) => text.items.map(({ str }) => str).join('\n'));
      }));
    }

    return Promise.all(countPromises).then((texts) => texts.join('\n'));
  });
}

export function extractDocumentText(fileType, rawBase64) {
  if (fileType === PDF_MIME_TYPE) {
    return getTextFromPDF(rawBase64);
  }
  if (fileType === DOCX_MIME_TYPE) {
    return getTextFromDocx(rawBase64);
  }
  return Promise.resolve(undefined);
}
