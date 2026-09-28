# WishBloom Birthday FINAL v1

This is the single combined project.

Included:
- Landing/creator page inspired by the interaction pattern of the referenced site, with original branding/design.
- Style/relationship/vibe customization.
- Name, birthday date, message, sender and up to 8 photos.
- Unique shareable `/b/<id>` birthday links.
- Interactive recipient flow: intro → balloon popping → memories → cake/candle → personal letter.
- Confetti and mobile responsive design.
- Server-side MP4 endpoint using FFmpeg when the host provides FFmpeg.
- Health endpoint at `/health`.

Local:
npm install
npm start

Then open http://localhost:3000

Important:
The reference site currently advertises a flow with style selection, relationship/vibe customization, personalized message, interactive balloons/candles/cake/letter, shareable links and personalized video. This project recreates the broad user experience with original code/assets rather than copying its proprietary implementation or branding.

For public production hosting:
- Node.js hosting is required.
- FFmpeg must be available if MP4 rendering is required.
- For scale, replace local JSON/uploads with a database + object storage.
- Add rate limiting, image validation, cleanup/retention, payment integration and HTTPS before taking real customer payments.
- Only use music/assets for which you have rights.
