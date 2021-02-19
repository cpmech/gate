export const downloadJson = (object: any, exportName: string) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object));
  const element = document.createElement('a');
  element.setAttribute('href', dataStr);
  element.setAttribute('download', exportName + '.json');
  element.setAttribute('target', '_blank');
  element.click();
  element.remove();
};

// reference:
// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
