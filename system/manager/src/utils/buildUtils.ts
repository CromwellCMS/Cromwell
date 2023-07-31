import path from 'path';

export const stderr = console.error.bind(console);

const init = (open, close) => {
  return raw(`\x1b[${open}m`, `\x1b[${close}m`, new RegExp(`\\x1b\\[${close}m`, 'g'), `\x1b[${open}m`);
};

const raw = (open, close, searchRegex, replaceValue) => (s) =>
  enabled
    ? open +
      (~(s += '').indexOf(close, 4) // skip opening \x1b[
        ? s.replace(searchRegex, replaceValue)
        : s) +
      close
    : s;

const enabled =
  !('NO_COLOR' in process.env) &&
  ('FORCE_COLOR' in process.env ||
    process.platform === 'win32' ||
    (process.stdout != null && process.stdout.isTTY && process.env.TERM && process.env.TERM !== 'dumb'));

//eslint-disable-next-line
export const bold = raw('\x1b[1m', '\x1b[22m', /\x1b\[22m/g, '\x1b[22m\x1b[1m');
//eslint-disable-next-line
export const dim = raw('\x1b[2m', '\x1b[22m', /\x1b\[22m/g, '\x1b[22m\x1b[2m');
export const underline = init(4, 24);
export const red = init(31, 39);
export const green = init(32, 39);
export const yellow = init(33, 39);
export const cyan = init(36, 39);
export const gray = init(90, 39);

function isAbsolute(path) {
  return absolutePath.test(path);
}

const absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/;

export function relativeId(id) {
  if (!isAbsolute(id)) return id;
  return path.relative(path.resolve(), id);
}

export function handleError(err, recover = false) {
  let description = err.message || err;
  if (err.name) description = `${err.name}: ${description}`;
  const message = (err.plugin ? `(plugin ${err.plugin}) ${description}` : description) || err;
  stderr(bold(red(`[!] ${bold(message.toString())}`)));
  if (err.url) {
    stderr(cyan(err.url));
  }
  if (err.loc) {
    stderr(`${relativeId(err.loc.file || err.id)} (${err.loc.line}:${err.loc.column})`);
  } else if (err.id) {
    stderr(relativeId(err.id));
  }
  if (err.frame) {
    stderr(dim(err.frame));
  }
  if (err.stack) {
    stderr(dim(err.stack));
  }
  stderr('');
  if (!recover) process.exit(1);
}
