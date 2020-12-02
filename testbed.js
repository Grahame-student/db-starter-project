const md5 = require('md5');
const bcrypt = require('bcrypt');

const testBed = async () => {
  const testString = "advanced databases";
  let i;
  for (i = 4; i < 21; i++) {
    await runHash(testString, i);
  }
}

async function runHash(inputString, iterations) {
  const start = new Date().getTime();

  let i;
  for (i = 0; i < 1000000; i++) {
    await md5(inputString);
  }

  //await bcrypt.hashSync(inputString, iterations)
  const end = new Date().getTime();
  const duration = (((end - start) / 1000000) / 1000.0);
  console.log(`Hashed using ${iterations} in ${duration} seconds`)
}

testBed();