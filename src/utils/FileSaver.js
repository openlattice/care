/*
 * @flow
 */

import FS from 'file-saver';

export default class FileSaver {

  static saveFile(
    entityData :Blob | File | string,
    name :string,
    contentType :string,
    success ?:(name :string, contentType :string) => void,
  ) {
    const blob = new Blob([entityData], {
      type: contentType
    });

    FS.saveAs(blob, name);
    if (success && success !== undefined) {
      success(name, contentType);
    }
  }
}
