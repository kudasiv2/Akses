# Akses Wileys Custom (Stable Fork Style)

Wrapper/custom untuk `wileys` terbaru dengan fokus stabilitas + helper siap pakai:

- Auto reconnect
- Multi-file auth
- Helper kirim button message
- Helper kirim list message
- Helper kirim image/document
- Helper download media

## Install

```bash
npm install
```

## Contoh pakai

```js
const {
  createStableClient,
  sendButtons,
  sendList,
} = require('./src')

async function main() {
  const sock = await createStableClient({ authDir: './auth' })

  await sendButtons(sock, '62812xxxx@s.whatsapp.net', {
    text: 'Halo, pilih menu:',
    footer: 'Akses Bot',
    buttons: [
      { id: 'menu-1', text: 'Menu 1' },
      { id: 'menu-2', text: 'Menu 2' },
    ],
  })

  await sendList(sock, '62812xxxx@s.whatsapp.net', {
    text: 'Daftar layanan',
    footer: 'Akses Bot',
    title: 'Layanan',
    buttonText: 'Lihat',
    sections: [
      {
        title: 'Utama',
        rows: [
          { title: 'Cek Saldo', rowId: 'cek-saldo' },
          { title: 'Topup', rowId: 'topup' },
        ],
      },
    ],
  })
}

main()
```

## Catatan stabilitas

- Menggunakan `fetchLatestBaileysVersion()` saat inisialisasi.
- Timeout koneksi, keepalive, dan retry dioptimasi default.
- Reconnect otomatis untuk disconnect selain logout.

