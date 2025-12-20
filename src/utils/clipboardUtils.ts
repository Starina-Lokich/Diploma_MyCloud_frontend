export const copyToClipboard = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // для современного API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // костыль для копирования публичной ссылки для протокола http
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        resolve(successful);
      } catch (err) {
        console.error('Copy error:', err);
        resolve(false);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  });
};
