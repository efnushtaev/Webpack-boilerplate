export default class Post {
  private title: string
  private date: Date

  constructor(title: string) {
    this.title = title;
    this.date = new Date();
  }

  public toString() {
    return JSON.stringify({
      title: this.title,
      date: this.date.toJSON(),
    }, null, 2);
  }
}
