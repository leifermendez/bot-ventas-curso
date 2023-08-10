const Queue = require("bull");

const processQueue = new Queue("message_process", "redis://redis:6380");

class QueueWS {
  constructor() {
    processQueue.process((job, done) => {
      setTimeout(() => {
        const { data } = job;
        console.log(data);
        done();
      }, 2000);
    });
  }

  addProcess = async (data = {}) => {
    processQueue.add(
      { data },
      {
        attempts: 1,
      }
    );
  };

  onProcess = () => {};
}

module.exports = QueueWS;
