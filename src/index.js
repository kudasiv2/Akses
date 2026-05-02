function getLogger() {
  return { info: console.log, warn: console.warn, error: console.error }
}

async function createStableClient({ authDir = './auth', printQRInTerminal = true } = {}) {
  const pino = require('pino')
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
  } = require('wileys')

  const logger = pino({ level: process.env.LOG_LEVEL || 'info' })
  const { state, saveCreds } = await useMultiFileAuthState(authDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal,
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 15_000,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    browser: ['AksesBot', 'Chrome', '1.0.0'],
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    logger,
    generateHighQualityLinkPreview: true,
  })

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) {
        logger.warn({ code }, 'Connection lost, reconnecting...')
        createStableClient({ authDir, printQRInTerminal }).catch((err) => logger.error(err))
      } else {
        logger.error('Session logged out. Delete auth folder and re-authenticate.')
      }
    }

    if (connection === 'open') logger.info('WhatsApp connected')
  })

  return sock
}

function buildButtonMessage({ text, footer = '', buttons = [] }) {
  return {
    text,
    footer,
    buttons: buttons.map((button, i) => ({
      buttonId: button.id || `btn-${i + 1}`,
      buttonText: { displayText: button.text },
      type: 1,
    })),
    headerType: 1,
  }
}

function buildListMessage({ text, footer = '', title = 'Menu', buttonText = 'Pilih', sections = [] }) {
  return { text, footer, title, buttonText, sections }
}

async function sendButtons(sock, jid, payload) {
  return sock.sendMessage(jid, buildButtonMessage(payload))
}

async function sendList(sock, jid, payload) {
  return sock.sendMessage(jid, buildListMessage(payload))
}

async function sendImage(sock, jid, { buffer, caption = '' }) {
  return sock.sendMessage(jid, { image: buffer, caption })
}

async function sendDocument(sock, jid, { buffer, fileName, mimetype }) {
  return sock.sendMessage(jid, { document: buffer, fileName, mimetype })
}

async function downloadMedia(msg, type = 'buffer') {
  const { downloadMediaMessage } = require('wileys')
  return downloadMediaMessage(msg, type, {}, { logger: getLogger() })
}

module.exports = {
  createStableClient,
  buildButtonMessage,
  buildListMessage,
  sendButtons,
  sendList,
  sendImage,
  sendDocument,
  downloadMedia,
}
