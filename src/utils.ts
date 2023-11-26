export async function copyToClipboard(input: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(input);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = input;
    textarea.style.position = 'absolute';
    textarea.style.left = '-99999999px';
    document.body.prepend(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.log(err);
    } finally {
      textarea.remove();
    }
  }
}
