import { bootstrap } from './main';

declare const module: any;

bootstrap().then((app) => {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
});
