class Graph {
  randomiser() {
    return Math.round(Math.random() * 30);
  }
  getGraph() {
    const count = 15;
    let result = [];
    for (let i = 1; i <= count; i++) {
      result.push({
        date: `${i < 10 ? `2023-03-0${i}` : `2023-03-${i}`}`,
        amount: `${this.randomiser()}`,
      });
    }
    return result;
  }
}
export default new Graph();
