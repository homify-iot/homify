export default class Automation {
  constructor(private job) {
    console.log(this.job);
    job.triggers.forEach(this.attachTrigger);
  }

  private attachTrigger(trigger) {

  }
}