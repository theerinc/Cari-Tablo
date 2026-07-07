# Şantiye Cari

İnşaat işleri için ön muhasebe web uygulaması: cari hesaplar, işlem takibi (nakit/havale/çek/senet) ve vadeli çek-senet onay akışı.

## Özellikler

- **Cari Hesaplar**: müşteri/tedarikçi/taşeron/personel cari kayıtları ve hesap ekstresi
- **İşlemler**: her işlem otomatik olarak ilgili carinin ekstresine yansır
- **Ödeme türleri**: Nakit, Havale/EFT, Çek, Senet
- **Vadeli çek/senet**: vadeli işaretlenen çek/senetler cari bakiyeye hemen yansır ama kasa/banka defterine işlenmez; vade günü geldiğinde `/vadeli` sayfasında onay bekler, admin onaylayınca kasaya/bankaya işlenir
- **Kasa/Banka defterleri**: yalnızca tamamlanmış işlemlerden oluşan çalışan bakiye
- **Roller**: Yönetici (tüm raporlar + vade onayı + kullanıcı yönetimi) / Personel (cari ve işlem girişi)

## Kurulum (Yerel Geliştirme)

1. Bağımlılıkları kurun:
   ```bash
   npm install
   ```

2. Yerel bir Postgres başlatın (Docker gerekmez):
   ```bash
   npx prisma dev
   ```
   Verilen bağlantı adresini `.env` dosyasındaki `DATABASE_URL` olarak ayarlayın (`.env.example` dosyasını kopyalayıp düzenleyin).

3. Şemayı veritabanına uygulayın:
   ```bash
   npx prisma db push
   ```

4. İlk admin kullanıcıyı oluşturun (`.env` içindeki `ADMIN_EMAIL`/`ADMIN_PASSWORD` kullanılır):
   ```bash
   npx prisma db seed
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Production'a Deploy (Vercel + Neon örneği)

1. [Neon](https://neon.tech) (veya Prisma Postgres / Supabase) üzerinde bir Postgres veritabanı oluşturun, bağlantı adresini alın.
2. Bu repoyu Vercel'e bağlayın, aşağıdaki environment variable'ları girin:
   - `DATABASE_URL` — hosted Postgres bağlantı adresi
   - `AUTH_SECRET` — `openssl rand -base64 32` ile üretin
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` — ilk kurulumda seed için
   - `CRON_SECRET` — rastgele bir gizli anahtar
3. Migration'ı hosted veritabanına uygulayın (yerelde `prisma/migrations/` altında hazır duran migration'ı kullanarak):
   ```bash
   DATABASE_URL="<neon-connection-string>" npx prisma migrate deploy
   DATABASE_URL="<neon-connection-string>" ADMIN_EMAIL=... ADMIN_PASSWORD=... npx prisma db seed
   ```
4. Deploy edin. `vercel.json` içindeki cron tanımı, `/api/cron/vade-kontrol` endpoint'ini her gün saat 06:00'da otomatik tetikler ve vadesi geçen çek/senetleri "Vadesi Geldi" durumuna alır (otomatik muhasebeleştirme yapmaz — onay admin tarafından `/vadeli` sayfasından verilir).

## Notlar

- Yeni kullanıcı kaydı (signup) sayfası yoktur; kullanıcılar yalnızca `/kullanicilar` sayfasından (admin) eklenir.
- Para tutarları `Decimal(14,2)` olarak saklanır; kur/çoklu para birimi desteklenmez.
