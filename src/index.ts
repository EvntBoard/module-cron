import { ConfigLoader } from "./ConfigLoader";
import { CronConnexion } from "./CronConnexion";

const main = async () => {
  const configLoader = new ConfigLoader();
  await configLoader.load();

  const conf = configLoader.getConfig();

  new CronConnexion(conf.host, conf.port, conf.name || 'cron', conf.cron);
};

main();
