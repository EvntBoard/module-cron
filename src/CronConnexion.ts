import { EvntComNode } from "evntcom-js/dist/node";
import { CronJob } from 'cron';

export class CronConnexion {
  private name: string;
  private evntCom: EvntComNode;
  private cron: string[];
  private jobs: Map<string, CronJob>

  constructor(
    evntBoardHost: string,
    evntBoardPort: number,
    name: string,
    cron: string[]
  ) {
    this.jobs = new Map<string, CronJob>();
    this.name = name;
    this.cron = cron;
    this.evntCom = new EvntComNode({
      name,
      port: evntBoardPort,
      host: evntBoardHost,
    });

    this.evntCom.onOpen = async () => {
      await this.evntCom.notify("newEvent", [
        "cron-load",
        null,
        { emitter: this.name },
      ]);

      this.cron.forEach((cronTime) => {
       this.createCron(cronTime, true);
      });
    };

    this.evntCom.expose("stop", this.stopCron);
    this.evntCom.expose("start", this.startCron);
    this.evntCom.expose("create", this.createCron);
    this.evntCom.expose("delete", this.deleteCron);
  }

  stopCron = (cronTime: string) => {
    if (!Array.from(this.jobs.keys()).includes(cronTime)) {
      return
    }
    const job = this.jobs.get(cronTime)
    job.stop();
  }

  startCron = (cronTime: string) => {
    if (!Array.from(this.jobs.keys()).includes(cronTime)) {
      return
    }
    const job = this.jobs.get(cronTime)
    job.start();
    this.evntCom.notify("newEvent", [
      "cron-start",
      { cron: cronTime  },
      { emitter: this.name },
    ]);
  }

  deleteCron = (cronTime: string) => {
    if (!Array.from(this.jobs.keys()).includes(cronTime)) {
      return
    }
    this.stopCron(cronTime)
    this.jobs.delete(cronTime)
    this.evntCom.notify("newEvent", [
      "cron-delete",
      { cron: cronTime  },
      { emitter: this.name },
    ]);
  }

  createCron = (cronTime: string, start: boolean = false) => {
    if (Array.from(this.jobs.keys()).includes(cronTime)) {
      return
    }

    this.evntCom.notify("newEvent", [
      "cron-create",
      { cron: cronTime },
      { emitter: this.name },
    ]);
    const job = new CronJob(cronTime, () => {
      this.evntCom.notify("newEvent", [
        "cron-tick",
        { cron: cronTime },
        { emitter: this.name },
      ]);
    }, () => {
      this.evntCom.notify("newEvent", [
        "cron-stop",
        { cron: cronTime },
        { emitter: this.name },
      ]);
    }, false, "America/New_York");
    this.jobs.set(cronTime, job)
    if (start) {
      job.start();
      this.evntCom.notify("newEvent", [
        "cron-start",
        { cron: cronTime  },
        { emitter: this.name },
      ]);
    }
  }
}
