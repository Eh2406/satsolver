import useSolver, { NON_WORKING_WEEKEND_DAYS, WORKING_WEEKEND_DAYS } from './custody.js';

useSolver(500).then(result => {
  result.forEach((result, i) => {
    console.log(`result ${i}`);
    console.log("s m t w t f s");
    for (let week = 0; week < 42; week += 7) {
      let line = "";
      for (let day = 0; day < 7; day++) {
        let cust = result.custody[week + day] == '1';
        let work = result.work[week + day] == '1';
        if (cust) {
          line += "S ";
          console.assert(!work);
        } else if (work) {
          line += "w "
        } else {
          line += "c "
        }
      }
      console.log(line);
    }
    console.log("");
  });

  console.log("S rate:");
  console.log("s \tm \tt \tw \tt \tf \ts");
  for (let week = 0; week < 42; week += 7) {
    let line = "";
    for (let day = 0; day < 7; day++) {
      let s = result.reduce((accumulator, r) => accumulator + Number(r.custody[week + day] == '1'), 0);
      line += s;
      line += '\t';
    }
    console.log(line);
  }
  console.log("");

  console.log("Work rate:");
  console.log("s \tm \tt \tw \tt \tf \ts");
  for (let week = 0; week < 42; week += 7) {
    let line = "";
    for (let day = 0; day < 7; day++) {
      let s = result.reduce((accumulator, r) => accumulator + Number(r.work[week + day] == '1'), 0);
      line += s;
      line += '\t';
    }
    console.log(line);
  }
  console.log("");

  console.log(result.length);
});
