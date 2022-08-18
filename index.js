const axios = require('axios');
const fs = require('fs');

let table = [];

getPeople();

function getPeople() {
  axios.get('https://swapi.dev/api/people/')
  .then(pRes => {
    const peopleList = pRes.data.results
    return axios.get('https://swapi.dev/api/planets/')
    .then(plRes => {
      const planetList = plRes.data.results
      for(let ele of planetList) {
        let obj = {};
        obj["name"] = ele.name
        obj["homeworldUrl"] = ele.url
        obj["residents"] = [];
        for (let person of peopleList) {
          if(person.homeworld === ele.url) {
            obj["residents"].push(person.name)
          } 
        }
        table.push(obj)
      }
      downloadFile(table)
    })
  }).catch(error => console.log(error));
  
}


function downloadFile(table) {
  let tbl = table;
	let output = '';
	tbl.forEach(element => {
		output += `${element.name} \n`
		element.residents.forEach((names) => {
			output += `- ${names} \n`
		})
		output += '\n'
	});
	fs.writeFile('citizens-super-secret-info.txt', output, function (err) {
    console.log("sucess 😎 - check the file named citizens-super-secret-info.txt")
		if (err) return console.log(err);
	});
}

