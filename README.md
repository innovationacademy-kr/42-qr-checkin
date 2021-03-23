# Seoul42 Cadet

```bash
$ git clone https://id@yona.okdevtv.com/kenu/seoul42-cadet
$ cd 42oauth
$ npm install
```

Register [an app](https://profile.intra.42.fr/oauth/applications) on 42 intra
and set the redirect URI to `http://localhost:3000/login/42/return`.

Copy `.env.sample` to `.env` and edit CLIENT_ID and CLIENT_SECRET info.

Start the server.

```bash
$ npm run start
```

Open a web browser and navigate to
[http://localhost:3000/](http://localhost:3000/)
to see the example in action.

## 42 API List
* [API List](./docs/42api.md)

## 이 문서의 저작권

<img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/cc-zero.png" width="80px"></img>
이 문서는 [CC0 (Public Domain, 크리에이티브 커먼즈 권리 포기)](LICENSE)로 누구나 영리적인 목적을 포함한 어떤 목적으로든 그리고 어떤 방법으로든 마음대로 사용할 수 있습니다.
